import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Car } from './car.entity';
@Table({ tableName: 'CarImages' })
export class CarImage extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Car)
  @Column
  car_id: number;

  @BelongsTo(() => Car)
  car: Car;

  @Column
  url: string;
}
