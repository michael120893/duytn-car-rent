import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Car } from "./car.entity";
import { User } from "./user.entity";
@Table({tableName:'CarReviews'})
export class CarReview extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    user_id: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Car)
    @Column
    car_id: number;

    @BelongsTo(() => Car)
    car: Car;

    @Column
    comment: string;

    @Column
    rating: number;
}
