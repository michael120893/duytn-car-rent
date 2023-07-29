import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsNumber()
  @IsNotEmpty()
  payment_status_id: number;
}
