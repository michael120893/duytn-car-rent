import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsEndDateAfterStartDate } from 'src/common/validations/validators/date.validator.constraints';

export class CreatePlaceOrderDto {
  @IsNumber()
  @IsNotEmpty()
  car_id: number;

  @IsDateString()
  @IsNotEmpty()
  pick_up_date: Date;

  @IsEndDateAfterStartDate('pick_up_date', {
    message: 'drop_off_date must be larger than pick_up_date',
  })
  @IsDateString()
  @IsNotEmpty()
  drop_off_date: Date;

  @IsString()
  @IsOptional()
  coupon_code?: string;

  @IsNumber()
  @IsNotEmpty()
  pick_up_city_id: number;

  @IsNumber()
  @IsNotEmpty()
  drop_off_city_id: number;

  @IsNumber()
  @IsOptional()
  billing_id?: number;

  @IsString()
  @IsNotEmpty()
  billing_name: string;

  @IsString()
  @IsNotEmpty()
  billing_phone_number: string;

  @IsString()
  @IsNotEmpty()
  billing_address: string;

  @IsString()
  @IsNotEmpty()
  billing_city: string;
}
