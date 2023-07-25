import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Payment } from './payment.entity';
import { OrderStatus } from './order.status.entity';
import { User } from '../../users/entities/user.entity';
import { Car } from 'src/modules/cars/entities/car.entity';

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

  @HasOne(() => Payment)
  payment: Payment;

  @Column
  drop_off_date: Date;

  @Column
  drop_off_location: String;

  @Column
  pick_up_date: Date;

  @Column
  pick_up_location: String;
}
