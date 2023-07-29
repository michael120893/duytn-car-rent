import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueuesModule } from 'src/modules/queues/queues.module';
import { User } from 'src/modules/users/entities/user.entity';
import { Car } from '../cars/entities/car.entity';
import { City } from './entities/city.entity';
import { Coupon } from './entities/coupon.entity';
import { CouponType } from './entities/coupon.type.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order.status.entity';
import { PaymentMethod } from './entities/payment.method.entity';
import { PaymentStatus } from './entities/payment.status.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

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
    QueuesModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
