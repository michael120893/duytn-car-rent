import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';

@Table({ tableName: 'Billings' })
export class Billing extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  billing_name: string;

  @Column
  billing_phone_number: string;

  @Column
  billing_address: string;

  @Column
  billing_city: string;
}
