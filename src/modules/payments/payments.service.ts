import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from 'models/car.entity';
import { Payment } from 'models/payment.entity';
import { PaymentMethod } from 'models/payment.method.entity';
import { PaymentStatus } from 'models/payment.status.entity';
import { Sequelize } from 'sequelize-typescript';
import { AppException } from 'src/common/customs/custom.exception';
import {
  Coupon as CouponEnum,
  OrderStatus as OrderStatusEnum,
  PaymenMethod as PaymenMethodEnum,
  PaymentStatus as PaymentStatusEnum,
} from 'src/common/enums/database.enum';
import { ExceptionCode } from 'src/common/enums/exception_code';
import { Coupon } from '../../../models/coupon.entity';
import { Order } from '../../../models/order.entity';
import { Paging } from '../cars/dto/paging.dto';
import { CreatePlaceOrderDto } from './dto/create-payment.dto';
import { GetAllOrdersDto } from './dto/get-all-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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
    @InjectModel(Coupon)
    private paymentModel: typeof Payment,
  ) {}

  async placeOrder(userId: number, createPlaceOrderDto: CreatePlaceOrderDto) {
    const t = await this.sequelize.transaction();
    try {
      if (await this.carAvailability(createPlaceOrderDto)) {
        const rawOrder = new Order();
        rawOrder.user_id = userId;
        rawOrder.car_id = createPlaceOrderDto.car_id;
        rawOrder.drop_off_date = createPlaceOrderDto.drop_off_date;
        rawOrder.drop_off_location = createPlaceOrderDto.drop_off_location;
        rawOrder.pick_up_date = createPlaceOrderDto.pick_up_date;
        rawOrder.pick_up_location = createPlaceOrderDto.pick_up_location;
        rawOrder.order_status_id = OrderStatusEnum.Renting;
        const order = await rawOrder.save({ transaction: t });

        const rawPayment = new Payment();
        rawPayment.order_id = order.id;
        rawPayment.user_id = userId;
        rawPayment.payment_status_id = PaymentStatusEnum.Pending;
        rawPayment.payment_method_id = PaymenMethodEnum.Cash;

        const car = await this.carModel.findOne({
          where: {
            id: createPlaceOrderDto.car_id,
          },
          transaction: t,
        });
        let price = car.price;

        if (createPlaceOrderDto.coupon_code) {
          const coupon = await this.couponModel.findOne({
            where: {
              code: createPlaceOrderDto.coupon_code,
            },
          });
          if (coupon) {
            if (coupon.id === CouponEnum.Percentage) {
              price = price - (price * coupon.discount_value) / 100;
            } else if (coupon.id === CouponEnum.FixedAmount) {
              price = price - coupon.discount_value;
            }
            rawPayment.coupon_id = coupon.id;
          }
        }
        rawPayment.price = price;
        const payment = await rawPayment.save({ transaction: t });
        await t.commit();
        return { order, payment };
      } else {
        throw AppException.badRequestException({
          code: ExceptionCode.BAD_REQUEST_CODE,
          message: `car_id ${createPlaceOrderDto.car_id} is not available or not found`,
        });
      }
    } catch (error) {
      await t.rollback();
      if (
        typeof error?.original?.code !== 'undefined' &&
        error.original.code === 'ER_NO_REFERENCED_ROW_2'
      ) {
        throw AppException.badRequestException({
          code: ExceptionCode.BAD_REQUEST_CODE,
          message: error?.original?.sqlMessage,
        });
      } else {
        throw error;
      }
    }
  }

  async carAvailability(
    createPlaceOrderDto: CreatePlaceOrderDto,
  ): Promise<boolean> {
    let carAvailable = !(await this.orderModel.findOne({
      where: {
        car_id: createPlaceOrderDto.car_id,
      },
    }));
    if (carAvailable) return true;

    const literalValue = Sequelize.literal(`(SELECT COUNT(*) FROM orders 
      WHERE (('${createPlaceOrderDto.pick_up_date}' BETWEEN orders.pick_up_date AND orders.drop_off_date) 
      OR ('${createPlaceOrderDto.drop_off_date}' BETWEEN orders.pick_up_date AND orders.drop_off_date) 
      OR (orders.pick_up_date BETWEEN '${createPlaceOrderDto.pick_up_date}' AND '${createPlaceOrderDto.drop_off_date}') 
      OR (orders.drop_off_date BETWEEN '${createPlaceOrderDto.pick_up_date}' AND '${createPlaceOrderDto.drop_off_date}')) 
      and orders.order_status_id = ${OrderStatusEnum.Renting}) = 0`);

    return !!(await this.carModel.findOne({
      include: [
        {
          model: Order,
          required: true,
          include: [
            {
              model: Payment,
              required: true,
              where: {
                literalValue,
              },
            },
          ],
        },
      ],
      where: {
        id: createPlaceOrderDto.car_id,
      },
    }));
  }

  async calculatePrice(createPlaceOrderDto: CreatePlaceOrderDto) {
    const car = await this.carModel.findOne({
      where: {
        id: createPlaceOrderDto.car_id,
      },
    });
    if (!car) {
      throw AppException.notFoundException({
        title: `car_id ${createPlaceOrderDto.car_id} is not found`,
      });
    }

    let price = car.price;

    if (createPlaceOrderDto.coupon_code) {
      const coupon = await this.couponModel.findOne({
        where: {
          code: createPlaceOrderDto.coupon_code,
        },
      });
      if (coupon) {
        if (coupon.id === CouponEnum.Percentage) {
          price = price - (price * coupon.discount_value) / 100;
        } else if (coupon.id === CouponEnum.FixedAmount) {
          price = price - coupon.discount_value;
        }
      }
    }
    return { total_rental_price: price };
  }

  async findAllOrders(getAllOrdersDto: GetAllOrdersDto) {
    const { limit, offset } = getAllOrdersDto;
    const result = await this.orderModel.findAndCountAll({
      include: {
        model: Payment,
        include: [PaymentMethod, PaymentStatus, Coupon],
      },
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
      include: {
        model: Payment,
        include: [PaymentMethod, PaymentStatus, Coupon],
      },
      where: {
        id: id,
      },
    });
    if (order) return order;

    throw AppException.notFoundException({
      title: `order_id ${id} is not found`,
    });
  }

  async updateOrder(id: number, updateOrder: UpdateOrderDto) {
    const [affectedCount, affectedRows] = await this.orderModel.update(
      {
        order_status_id: updateOrder.order_status_id,
      },
      {
        where: { id },
        returning: true,
      },
    );
    console.log('result: ' + affectedCount + ' ' + affectedRows);
    if (!affectedRows) {
      throw AppException.notFoundException({
        title: `order_id ${id} is not found`,
      });
    }
  }

  async updatePayment(id: number, updatePayment: UpdatePaymentDto) {
    const [affectedCount, affectedRows] = await this.paymentModel.update(
      {
        payment_status_id: updatePayment.payment_status_id,
      },
      {
        where: { id },
        returning: true,
      },
    );
    console.log('result: ' + affectedCount + ' ' + affectedRows);
    if (!affectedRows) {
      throw AppException.notFoundException({
        title: `payment_id ${id} is not found`,
      });
    }
  }
}
