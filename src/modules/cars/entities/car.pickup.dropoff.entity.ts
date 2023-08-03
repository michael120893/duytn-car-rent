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
import { City } from 'src/modules/orders/entities/city.entity';
@Table({ tableName: 'PickupDropoffCars' })
export class CarPickupDropoff extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Car)
  @Column
  car_id: number;

  @BelongsTo(() => Car)
  car: Car;

  @ForeignKey(() => City)
  @Column
  pickup_city_id: number;

  @BelongsTo(() => City)
  pickupCity: City;

  @ForeignKey(() => City)
  @Column
  dropoff_city_id: number;

  @BelongsTo(() => City)
  dropoffCity: City;
}
