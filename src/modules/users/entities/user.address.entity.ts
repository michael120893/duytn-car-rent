import { Exclude } from 'class-transformer';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ tableName: 'UserAddresses' })
export class UserAddress extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Exclude()
  @Column
  address: string;

  @Column
  city: string;

  @Column
  postal_code: string;

  @Column
  contry: string;
}
