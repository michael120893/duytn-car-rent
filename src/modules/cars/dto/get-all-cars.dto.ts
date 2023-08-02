import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetAllCarsDto {
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  readonly offset?: number;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @IsOptional()
  @IsNumber()
  readonly gasoline?: number;

  @IsOptional()
  @IsNumber()
  readonly pickup_city_id?: number;

  @IsOptional()
  @IsNumber()
  readonly dropoff_city_id?: number;

  @IsOptional()
  @IsNumber()
  readonly car_type_id?: number;

  @IsDateString()
  @IsNotEmpty()
  pick_up_date: Date;

  @IsDateString()
  @IsNotEmpty()
  drop_off_date: Date;
}
