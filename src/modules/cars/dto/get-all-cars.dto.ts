import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  readonly price?: number;

  @IsOptional()
  @IsString()
  readonly gasoline?: number;
}
