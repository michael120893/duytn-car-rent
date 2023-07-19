import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @IsNumber()
  @IsNotEmpty()
  car_type_id: number;

  @IsNumber()
  @IsNotEmpty()
  car_steering_id: number;

  @IsNumber()
  @IsNotEmpty()
  car_capacity_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  gasoline: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  original_price: number;

  @IsString()
  licence_plates: string;
}