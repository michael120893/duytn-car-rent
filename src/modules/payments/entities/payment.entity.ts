import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PaymentStatus } from './payment.status.entity';
import { PaymentMethod } from './payment.method.entity';
import { Coupon } from './coupon.entity';
import { Order } from './order.entity';
import { User } from '../../users/entities/user.entity';

@Table({ tableName: 'Payments' })
export class Payment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Order)
  @Column
  order_id: number;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => PaymentStatus)
  @Column
  payment_status_id: number;

  @BelongsTo(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @ForeignKey(() => PaymentMethod)
  @Column
  payment_method_id: number;

  @BelongsTo(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @ForeignKey(() => Coupon)
  @Column
  coupon_id: number;

  @BelongsTo(() => Coupon)
  coupon: Coupon;

  @Column
  price: number;
}
