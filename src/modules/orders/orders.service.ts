import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  Coupon as CouponEnum,
  OrderStatus as OrderStatusEnum,
  PaymenMethod as PaymenMethodEnum,
  PaymentStatus as PaymentStatusEnum,
} from 'src/common/enums/database.enum';
import {
  AppException,
  AppExceptionBody,
} from 'src/common/exeptions/app.exception';
import { Paging } from '../cars/dto/paging.dto';
import { Car } from '../cars/entities/car.entity';
import { CarType } from '../cars/entities/car.type.entity';
import { CreatePlaceOrderDto } from '../payments/dto/create-payment.dto';
import { GetAllOrdersDto } from '../payments/dto/get-all-orders.dto';
import { UpdateOrderStatusDto } from '../payments/dto/update-order-status.dto';
import { PaymentMethod } from '../payments/entities/payment.method.entity';
import { PaymentStatus } from '../payments/entities/payment.status.entity';
import { QueueService } from '../queues/queues.service';
import { User } from '../users/entities/user.entity';
import { Billing } from './entities/billing.entity';

import * as moment from 'moment-timezone';
import { Order } from './entities/order.entity';
import { Coupon } from './entities/coupon.entity';
import { City } from './entities/city.entity';
import { OrderHistory } from './entities/order.history.entity';
@Injectable()
export class OrdersService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly queueService: QueueService,

    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Coupon)
    private couponModel: typeof Coupon,
    @InjectModel(Car)
    private carModel: typeof Car,
    @InjectModel(City)
    private cityModel: typeof City,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Billing)
    private billingModel: typeof Billing,
  ) {}

  async findAllOrders(getAllOrdersDto: GetAllOrdersDto) {
    const { limit, offset } = getAllOrdersDto;
    const result = await this.orderModel.findAndCountAll({
      include: [PaymentMethod, PaymentStatus, Coupon],
      limit: +limit,
      offset: +offset,
    });

    return new Paging(result.rows, {
      total: result.count,
      limit: +limit,
      offset: +offset,
    });
  }

  async findOrder(id: number): Promise<Order> {
    const order = await this.orderModel.findOne({
      include: [PaymentMethod, PaymentStatus, Coupon],
      where: {
        id: id,
      },
    });
    if (order) return order;

    throw AppException.notFoundException(AppExceptionBody.orderNotFound());
  }

  async updateOrder(id: number, updateOrder: UpdateOrderStatusDto) {
    const order = await this.findOrder(id);
    if (!order) {
      throw AppException.notFoundException(AppExceptionBody.orderNotFound());
    }
    await this.orderModel.update(
      {
        order_status_id: updateOrder.order_status_id,
      },
      {
        where: { id },
        returning: true,
      },
    );
  }

  async placeOrder(userId: number, createPlaceOrderDto: CreatePlaceOrderDto) {
    const car = await this.carModel.findOne({
      where: { id: createPlaceOrderDto.car_id },
    });
    if (!car) {
      throw AppException.notFoundException(AppExceptionBody.carNotFound());
    }

    const pickupCity = await this.cityModel.findOne({
      where: { id: createPlaceOrderDto.pick_up_city_id },
    });
    if (!pickupCity) {
      throw AppException.notFoundException(AppExceptionBody.cityNotFound());
    }

    const dropoffCity = await this.cityModel.findOne({
      where: { id: createPlaceOrderDto.drop_off_city_id },
    });
    if (!dropoffCity) {
      throw AppException.notFoundException(AppExceptionBody.cityNotFound());
    }

    let coupon: Coupon | null;
    if (createPlaceOrderDto.coupon_code) {
      coupon = await this.couponModel.findOne({
        where: {
          code: createPlaceOrderDto.coupon_code,
        },
      });

      if (coupon) {
        if (!coupon.active) {
          throw AppException.notFoundException(
            AppExceptionBody.couponIsExpired(),
          );
        }
      } else {
        throw AppException.notFoundException(AppExceptionBody.couponNotFound());
      }
    }

    const transaction = await this.sequelize.transaction();
    try {
      if (await this.carAvailability(createPlaceOrderDto, transaction)) {
        //insert billing
        const billing_id = await this.insertBilling(
          userId,
          createPlaceOrderDto,
          transaction,
        );

        //insert order
        const rawOrder = new Order();
        rawOrder.user_id = userId;
        rawOrder.billing_id = billing_id;
        rawOrder.car_id = createPlaceOrderDto.car_id;
        rawOrder.drop_off_date = createPlaceOrderDto.drop_off_date;
        rawOrder.drop_off_city_id = createPlaceOrderDto.drop_off_city_id;
        rawOrder.pick_up_date = createPlaceOrderDto.pick_up_date;
        rawOrder.pick_up_city_id = createPlaceOrderDto.pick_up_city_id;

        rawOrder.order_status_id = OrderStatusEnum.Renting;
        rawOrder.payment_status_id = PaymentStatusEnum.Pending;
        rawOrder.payment_method_id = PaymenMethodEnum.Cash;

        //calculate price
        const car = await this.carModel.findOne({
          include: [CarType],
          where: {
            id: createPlaceOrderDto.car_id,
          },
          transaction: transaction,
        });

        const startDate = moment(createPlaceOrderDto.pick_up_date);
        const endDate = moment(createPlaceOrderDto.drop_off_date);
        const diffInDays = endDate.diff(startDate, 'days');

        let subtotal = car.price * (diffInDays === 0 ? 1 : diffInDays);
        let discount = 0;

        if (coupon) {
          if (coupon.id === CouponEnum.Percentage) {
            discount = (subtotal * coupon.discount_value) / 100;
          } else if (coupon.id === CouponEnum.FixedAmount) {
            discount = coupon.discount_value;
          }
          rawOrder.coupon_id = coupon.id;
        }

        rawOrder.sub_total = subtotal;
        rawOrder.discount = discount;
        rawOrder.total = subtotal - discount;

        const user = await this.userModel.findByPk(userId, {
          transaction: transaction,
        });
        const order = await rawOrder.save({ transaction: transaction });

        //insert order_history
        const orderHistory = new OrderHistory();
        orderHistory.order_id = order.id;
        orderHistory.payment_status_id = PaymentStatusEnum.Pending;
        orderHistory.order_status_id = OrderStatusEnum.Renting;
        await orderHistory.save({ transaction: transaction });

        //send mail
        this.queueService.sendPlaceOrderMail(
          user.email,
          user.name,
          `${car.carType.type} - ${car.licence_plates}`,
          order.pick_up_date.toString(),
          order.drop_off_date.toString(),
          subtotal - discount,
          PaymenMethodEnum[1],
        );
        await transaction.commit();
        return order;
      } else {
        throw AppException.badRequestException(
          AppExceptionBody.carNotAvailable(),
        );
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async insertBilling(
    userId: number,
    createPlaceOrderDto: CreatePlaceOrderDto,
    transaction: Transaction,
  ): Promise<number> {
    const {
      billing_id,
      billing_name,
      billing_phone_number,
      billing_address,
      billing_city,
    } = createPlaceOrderDto;
    const billing = billing_id
      ? await this.billingModel.findByPk(billing_id, {
          transaction: transaction,
        })
      : null;
    if (billing) {
      await this.billingModel.update(
        {
          billing_name: billing_name,
          billing_phone_number: billing_phone_number,
          billing_address: billing_address,
          billing_city: billing_city,
        },
        {
          where: { id: billing_id },
          transaction: transaction,
        },
      );
      return billing_id;
    } else {
      const rawBilling = new Billing();
      rawBilling.user_id = userId;
      rawBilling.billing_name = billing_name;
      rawBilling.billing_phone_number = billing_phone_number;
      rawBilling.billing_address = billing_address;
      rawBilling.billing_city = billing_city;

      await rawBilling.save({ transaction: transaction });
      return rawBilling.id;
    }
  }

  async carAvailability(
    createPlaceOrderDto: CreatePlaceOrderDto,
    transaction: Transaction,
  ): Promise<boolean> {
    const {
      car_id,
      pick_up_city_id,
      drop_off_city_id,
      pick_up_date,
      drop_off_date,
    } = createPlaceOrderDto;

    let carAvailable = await this.carModel.findOne({
      attributes: ['id'],
      where: {
        [Op.and]: [
          { id: car_id },
          {
            id: {
              [Op.in]: Sequelize.literal(
                `(SELECT car_id FROM PickupDropoffCars where pickup_city_id = ${pick_up_city_id})`,
              ),
            },
          },
          {
            id: {
              [Op.in]: Sequelize.literal(
                `(SELECT car_id FROM PickupDropoffCars where dropoff_city_id = ${drop_off_city_id})`,
              ),
            },
          },
          {
            id: {
              [Op.notIn]: [
                Sequelize.literal(
                  `(SELECT car_id from Orders 
                    WHERE 
                    Orders.order_status_id = ${OrderStatusEnum.Renting} AND 
                      (
                        ('${pick_up_date}' BETWEEN Orders.pick_up_date AND Orders.drop_off_date) OR 
                        ('${drop_off_date}' BETWEEN Orders.pick_up_date AND Orders.drop_off_date) OR 
                        (Orders.pick_up_date BETWEEN '${pick_up_date}' AND '${drop_off_date}') OR 
                        (Orders.drop_off_date BETWEEN '${pick_up_date}' AND '${drop_off_date}')
                      )
                    )`,
                ),
              ],
            },
          },
        ],
      },
      lock: transaction.LOCK.UPDATE,
      transaction: transaction,
    });
    return !!carAvailable;
  }

  async calculatePrice(createPlaceOrderDto: CreatePlaceOrderDto) {
    const car = await this.carModel.findOne({
      where: {
        id: createPlaceOrderDto.car_id,
      },
    });
    if (!car) {
      throw AppException.notFoundException(AppExceptionBody.carNotFound());
    }

    let subtotal = car.price;
    let discount = 0;

    if (createPlaceOrderDto.coupon_code) {
      const coupon = await this.couponModel.findOne({
        where: {
          code: createPlaceOrderDto.coupon_code,
        },
      });
      if (coupon) {
        if (coupon.id === CouponEnum.Percentage) {
          discount = (subtotal * coupon.discount_value) / 100;
        } else if (coupon.id === CouponEnum.FixedAmount) {
          discount = coupon.discount_value;
        }
      }
    }
    return {
      sub_total: subtotal,
      discount: discount,
      total: subtotal - discount,
    };
  }
}
