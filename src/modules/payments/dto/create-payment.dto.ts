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

  @IsNotEmpty()
  pick_up_location: String;

  @IsEndDateAfterStartDate('pick_up_date', {
    message: 'drop_off_date must be larger than pick_up_date',
  })
  @IsDateString()
  @IsNotEmpty()
  drop_off_date: Date;

  @IsNotEmpty()
  drop_off_location: String;

  @IsString()
  @IsOptional()
  coupon_code?: String;
}
