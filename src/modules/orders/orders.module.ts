import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from '../cars/entities/car.entity';
import { City } from '../payments/entities/city.entity';
import { Coupon } from '../payments/entities/coupon.entity';
import { CouponType } from '../payments/entities/coupon.type.entity';
import { Order } from '../payments/entities/order.entity';
import { OrderStatus } from '../payments/entities/order.status.entity';
import { PaymentMethod } from '../payments/entities/payment.method.entity';
import { PaymentStatus } from '../payments/entities/payment.status.entity';
import { User } from '../users/entities/user.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentStatus,
      PaymentMethod,
      Coupon,
      CouponType,
      Car,
      Order,
      OrderStatus,
      User,
      City,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
