import { Exclude } from "class-transformer";
import { AutoIncrement, Column, HasMany, HasOne, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

import { UserInfo } from "./user.info.entity";
import { Order } from "../../payments/entities/order.entity";
import { CarReview } from "src/modules/cars/entities/car.review.entity";

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

    @Column
    avatar_url: string;

    @HasOne(() => UserInfo)
    userIndo: UserInfo;

    @HasMany(() => Order)
    orders: Order[];

    @HasMany(() => CarReview)
    carReviews: CarReview[];
}
