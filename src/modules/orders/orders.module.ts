import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from '../cars/entities/car.entity';
import { PaymentMethod } from '../payments/entities/payment.method.entity';
import { PaymentStatus } from '../payments/entities/payment.status.entity';
import { QueuesModule } from '../queues/queues.module';
import { User } from '../users/entities/user.entity';
import { Billing } from './entities/billing.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { City } from './entities/city.entity';
import { Coupon } from './entities/coupon.entity';
import { CouponType } from './entities/coupon.type.entity';
import { Order } from './entities/order.entity';
import { OrderHistory } from './entities/order.history.entity';
import { OrderStatus } from './entities/order.status.entity';

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
      Billing,
      OrderHistory,
    ]),
    QueuesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
