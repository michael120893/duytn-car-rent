import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewCarDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  car_id: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;
}