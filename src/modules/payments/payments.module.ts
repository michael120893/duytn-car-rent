import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueuesModule } from 'src/queues/queues.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Car } from 'db/models/car.entity';
import { Coupon } from 'db/models/coupon.entity';
import { CouponType } from 'db/models/coupon.type.entity';
import { Order } from 'db/models/order.entity';
import { OrderStatus } from 'db/models/order.status.entity';
import { Payment } from 'db/models/payment.entity';
import { PaymentMethod } from 'db/models/payment.method.entity';
import { PaymentStatus } from 'db/models/payment.status.entity';
import { User } from 'db/models/user.entity';

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
