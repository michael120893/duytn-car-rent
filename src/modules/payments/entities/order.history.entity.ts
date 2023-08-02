import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Order } from './order.entity';
import { OrderStatus } from './order.status.entity';
import { PaymentStatus } from './payment.status.entity';

@Table({ tableName: 'OrderHistories' })
export class OrderHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Order)
  @Column
  order_id: number;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => OrderStatus)
  @Column
  order_status_id: number;

  @BelongsTo(() => OrderStatus)
  orderStatus: OrderStatus;

  @ForeignKey(() => PaymentStatus)
  @Column
  payment_status_id: number;

  @BelongsTo(() => PaymentStatus)
  paymentStatus: PaymentStatus;
}
