import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/modules/payments/entities/order.entity';
import { CarCapacity } from './car.capacity.entity';
import { CarImage } from './car.image.entity';
import { CarReview } from './car.review.entity';
import { CarSteering } from './car.steering.entity';
import { CarType } from './car.type.entity';
@Table({ tableName: 'Cars' })
export class Car extends Model<Car> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => CarType)
  @Column
  car_type_id: number;

  @BelongsTo(() => CarType)
  carType: CarType;

  @ForeignKey(() => CarSteering)
  @Column
  car_steering_id: number;

  @BelongsTo(() => CarSteering)
  carSteering: CarSteering;

  @ForeignKey(() => CarCapacity)
  @Column
  car_capacity_id: number;

  @BelongsTo(() => CarCapacity)
  carCapacity: CarCapacity;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  gasoline: number;

  @Column
  price: number;

  @Column
  original_price: number;

  @Column
  licence_plates: string;

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => CarImage)
  images: CarImage[];

  @HasMany(() => CarReview)
  reviews: CarReview[];
}
