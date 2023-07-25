import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Car } from './car.entity';
@Table({ tableName: 'CarSteerings' })
export class CarSteering extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  steering: string;

  @HasMany(() => Car)
  cars: Car[];
}
