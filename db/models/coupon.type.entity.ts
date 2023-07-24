import { AutoIncrement, Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Coupon } from "./coupon.entity";

@Table({tableName:'CouponTypes'})
export class CouponType extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    type: String;

    @HasMany(() => Coupon)
    coupons: Coupon[]
}
