import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/modules/orders/entities/order.entity';

@Table({ tableName: 'PaymentStatuses' })
export class PaymentStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  status: String;

  @HasMany(() => Order)
  orders: Order[];
}
