import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueuesModule } from 'src/modules/queues/queues.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { User } from 'src/modules/users/entities/user.entity';
import { Car } from '../cars/entities/car.entity';
import { Coupon } from './entities/coupon.entity';
import { CouponType } from './entities/coupon.type.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order.status.entity';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment.method.entity';
import { PaymentStatus } from './entities/payment.status.entity';

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
