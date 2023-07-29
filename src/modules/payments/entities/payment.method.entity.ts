import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Order } from './order.entity';

@Table({ tableName: 'PaymentMethods' })
export class PaymentMethod extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  method: String;

  @HasMany(() => Order)
  orders: Order[];
}
