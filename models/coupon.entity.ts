import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { CouponType } from "./coupon.type.entity";
import { Payment } from "./payment.entity";

@Table({tableName:'Coupons'})
export class Coupon extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Unique
    @Column
    code: String;

    @ForeignKey(() => CouponType)
    @Column
    discount_type_id: number;

    @BelongsTo(() => CouponType)
    couponType: CouponType;

    @Column
    discount_value: number;

    @Column
    expiration_date: Date;

    @Column
    active: boolean;

    @Column
    description: String

    @HasMany(() => Payment)
    payments: Payment[]
}
