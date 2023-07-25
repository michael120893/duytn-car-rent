import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Payment } from './payment.entity';

@Table({ tableName: 'PaymentStatuses' })
export class PaymentStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  status: String;

  @HasMany(() => Payment)
  payments: Payment[];
}
