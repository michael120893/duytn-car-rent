import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCarImageDto {
  @IsNumber()
  @IsNotEmpty()
  car_id: number;

  @IsString()
  @IsNotEmpty()
  url: string;
}
