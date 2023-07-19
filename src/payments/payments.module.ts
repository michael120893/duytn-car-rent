import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from 'models/car.entity';
import { Coupon } from 'models/coupon.entity';
import { CouponType } from 'models/coupon.type.entity';
import { Order } from 'models/order.entity';
import { OrderStatus } from 'models/order.status.entity';
import { PaymentMethod } from 'models/payment.method.entity';
import { PaymentStatus } from 'models/payment.status.entity';
import { Payment } from 'models/payment.entity';

@Module({
  imports: [SequelizeModule.forFeature([PaymentStatus, PaymentMethod, Payment, Coupon, CouponType, Car, Order, OrderStatus])],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
