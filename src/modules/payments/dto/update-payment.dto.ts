import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  payment_status_id: number;
}
