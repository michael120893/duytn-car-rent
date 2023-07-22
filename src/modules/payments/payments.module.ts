import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from 'models/car.entity';
import { Coupon } from 'models/coupon.entity';
import { CouponType } from 'models/coupon.type.entity';
import { Order } from 'models/order.entity';
import { OrderStatus } from 'models/order.status.entity';
import { Payment } from 'models/payment.entity';
import { PaymentMethod } from 'models/payment.method.entity';
import { PaymentStatus } from 'models/payment.status.entity';
import { User } from 'models/user.entity';
import { QueuesModule } from 'src/queues/queues.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentStatus,
      PaymentMethod,
      Payment,
      Coupon,
      CouponType,
      Car,
      Order,
      OrderStatus,
      User,
    ]),
    QueuesModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
