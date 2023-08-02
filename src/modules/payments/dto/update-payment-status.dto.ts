import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;
  @IsNumber()
  @IsNotEmpty()
  payment_status_id: number;
}
