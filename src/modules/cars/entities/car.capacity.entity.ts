import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Car } from './car.entity';
@Table({ tableName: 'CarCapacities' })
export class CarCapacity extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  capacity: number;

  @HasMany(() => Car)
  cars: Car[];
}
