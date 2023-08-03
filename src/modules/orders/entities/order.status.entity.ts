import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'OrderStatuses' })
export class OrderStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  status: String;
}
