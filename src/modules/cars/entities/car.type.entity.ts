import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Car } from './car.entity';
@Table({ tableName: 'CarTypes' })
export class CarType extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  type: string;

  @HasMany(() => Car)
  cars: Car[];
}
