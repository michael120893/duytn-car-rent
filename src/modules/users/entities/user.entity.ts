import { Exclude } from 'class-transformer';
import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import { Role } from 'src/common/enums/role.enum';
import { CarReview } from 'src/modules/cars/entities/car.review.entity';
import { UserAddress } from './user.address.entity';
import { Order } from 'src/modules/orders/entities/order.entity';

@Table({ tableName: 'Users' })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Exclude()
  @Column
  password: string;

  @Unique('email')
  @Column
  email: string;

  @Column
  phone: string;

  @Column({
    type: DataType.ENUM(Role.Admin, Role.User),
    allowNull: false,
    defaultValue: Role.User,
  })
  role: string;

  @Column
  avatar_url: string;

  @HasOne(() => UserAddress)
  userAddress: UserAddress;

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => CarReview)
  carReviews: CarReview[];
}
