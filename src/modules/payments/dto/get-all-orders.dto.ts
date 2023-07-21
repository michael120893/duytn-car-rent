import { IsNumber, IsOptional } from 'class-validator';

export class GetAllOrdersDto {
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  readonly offset?: number;
}
