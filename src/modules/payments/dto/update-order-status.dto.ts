import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNumber()
  @IsNotEmpty()
  order_status_id: number;
}
