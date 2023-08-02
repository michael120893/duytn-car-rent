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
import { Coupon } from 'src/modules/payments/entities/coupon.entity';
import { Order } from 'src/modules/payments/entities/order.entity';
import { QueueService } from 'src/modules/queues/queues.service';
import { User } from 'src/modules/users/entities/user.entity';
import { Car } from '../cars/entities/car.entity';
import { CarType } from '../cars/entities/car.type.entity';
import { Billing } from '../orders/entities/billing.entity';
import { CreatePlaceOrderDto } from './dto/create-payment.dto';
import { City } from './entities/city.entity';
import { OrderHistory } from './entities/order.history.entity';
@Injectable()
export class PaymentsService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(Coupon)
    private couponModel: typeof Coupon,
    @InjectModel(Car)
    private carModel: typeof Car,
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(City)
    private cityModel: typeof City,
    private readonly queueService: QueueService,
  ) {}

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

    const t = await this.sequelize.transaction();
    try {
      if (await this.carAvailability(createPlaceOrderDto, t)) {
        const rawBilling = new Billing();
        rawBilling.user_id = userId;
        rawBilling.billing_name = createPlaceOrderDto.billing_name;
        rawBilling.billing_phone_number =
          createPlaceOrderDto.billing_phone_number;
        rawBilling.billing_address = createPlaceOrderDto.billing_address;
        rawBilling.billing_city = createPlaceOrderDto.billing_city;
        const billing = await rawBilling.save({ transaction: t });

        const rawOrder = new Order();
        rawOrder.user_id = userId;
        rawOrder.billing_id = billing.id;
        rawOrder.car_id = createPlaceOrderDto.car_id;
        rawOrder.drop_off_date = createPlaceOrderDto.drop_off_date;
        rawOrder.drop_off_city_id = createPlaceOrderDto.drop_off_city_id;
        rawOrder.pick_up_date = createPlaceOrderDto.pick_up_date;
        rawOrder.pick_up_city_id = createPlaceOrderDto.pick_up_city_id;

        rawOrder.order_status_id = OrderStatusEnum.Renting;
        rawOrder.payment_status_id = PaymentStatusEnum.Pending;
        rawOrder.payment_method_id = PaymenMethodEnum.Cash;

        const car = await this.carModel.findOne({
          include: [CarType],
          where: {
            id: createPlaceOrderDto.car_id,
          },
          transaction: t,
        });
        let subtotal = car.price;
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
          transaction: t,
        });

        const order = await rawOrder.save({ transaction: t });

        const orderHistory = new OrderHistory();
        orderHistory.order_id = order.id;
        orderHistory.payment_status_id = PaymentStatusEnum.Pending;
        orderHistory.order_status_id = OrderStatusEnum.Renting;
        await orderHistory.save({ transaction: t });

        this.queueService.sendPlaceOrderMail(
          user.email,
          user.name,
          `${car.carType.type} - ${car.licence_plates}`,
          order.pick_up_date.toString(),
          order.drop_off_date.toString(),
          subtotal - discount,
          PaymenMethodEnum[1],
        );
        await t.commit();
        return order;
      } else {
        throw AppException.badRequestException(
          AppExceptionBody.carNotAvailable(),
        );
      }
    } catch (error) {
      await t.rollback();
      throw error;
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
