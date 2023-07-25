import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  order_status_id: number;
}
