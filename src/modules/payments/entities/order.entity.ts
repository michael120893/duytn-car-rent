import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Car } from 'src/modules/cars/entities/car.entity';
import { Billing } from 'src/modules/orders/entities/billing.entity';
import { User } from '../../users/entities/user.entity';
import { City } from './city.entity';
import { Coupon } from './coupon.entity';
import { OrderStatus } from './order.status.entity';
import { PaymentMethod } from './payment.method.entity';
import { PaymentStatus } from './payment.status.entity';

@Table({ tableName: 'Orders' })
export class Order extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Car)
  @Column
  car_id: number;

  @BelongsTo(() => Car)
  car: Car;

  @ForeignKey(() => OrderStatus)
  @Column
  order_status_id: number;

  @BelongsTo(() => OrderStatus)
  orderStatus: OrderStatus;

  @Column
  drop_off_date: Date;

  @Column
  pick_up_date: Date;

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

  @ForeignKey(() => Billing)
  @Column
  billing_id: number;

  @BelongsTo(() => Billing)
  billing: Billing;

  @ForeignKey(() => City)
  @Column
  pick_up_city_id: number;

  @BelongsTo(() => City)
  pickUpCity: City;

  @ForeignKey(() => City)
  @Column
  drop_off_city_id: number;

  @BelongsTo(() => City)
  dropOffCity: City;

  @Column
  total: number;

  @Column
  sub_total: number;

  @Column
  discount: number;
}
