import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AppException } from 'src/common/customs/custom.exception';
import {
  Coupon as CouponEnum,
  OrderStatus as OrderStatusEnum,
  PaymenMethod as PaymenMethodEnum,
  PaymentStatus as PaymentStatusEnum,
} from 'src/common/enums/database.enum';
import { ExceptionCode } from 'src/common/enums/exception_code';
import { Coupon } from 'src/modules/payments/entities/coupon.entity';
import { Order } from 'src/modules/payments/entities/order.entity';
import { QueueService } from 'src/modules/queues/queues.service';
import { User } from 'src/modules/users/entities/user.entity';
import { Car } from '../cars/entities/car.entity';
import { CarType } from '../cars/entities/car.type.entity';
import { CreatePlaceOrderDto } from './dto/create-payment.dto';
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
    private readonly queueService: QueueService,
  ) {}

  async placeOrder(userId: number, createPlaceOrderDto: CreatePlaceOrderDto) {
    const t = await this.sequelize.transaction();
    try {
      if (await this.carAvailability(createPlaceOrderDto)) {
        const rawOrder = new Order();
        rawOrder.user_id = userId;
        rawOrder.car_id = createPlaceOrderDto.car_id;
        rawOrder.drop_off_date = createPlaceOrderDto.drop_off_date;
        rawOrder.drop_off_city_id = createPlaceOrderDto.drop_off_city_id;
        rawOrder.pick_up_date = createPlaceOrderDto.pick_up_date;
        rawOrder.pick_up_city_id = createPlaceOrderDto.pick_up_city_id;

        rawOrder.order_status_id = OrderStatusEnum.Renting;
        rawOrder.payment_status_id = PaymentStatusEnum.Pending;
        rawOrder.payment_method_id = PaymenMethodEnum.Cash;

        rawOrder.billing_name = createPlaceOrderDto.billing_name;
        rawOrder.billing_phone_number =
          createPlaceOrderDto.billing_phone_number;
        rawOrder.billing_address = createPlaceOrderDto.billing_address;
        rawOrder.billing_city = createPlaceOrderDto.billing_city;

        const car = await this.carModel.findOne({
          include: [CarType],
          where: {
            id: createPlaceOrderDto.car_id,
          },
          transaction: t,
        });
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
            rawOrder.coupon_id = coupon.id;
          }
        }
        rawOrder.sub_total = subtotal;
        rawOrder.discount = discount;
        rawOrder.total = subtotal - discount;

        const user = await this.userModel.findByPk(userId, {
          transaction: t,
        });

        const order = await rawOrder.save({ transaction: t });

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
        },
      ],
      where: {
        id: createPlaceOrderDto.car_id,
        [Op.and]: [literalValue],
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
