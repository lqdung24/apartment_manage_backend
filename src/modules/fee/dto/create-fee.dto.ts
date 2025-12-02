import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { FeeType, FeeFrequency } from '@prisma/client';

export class CreateFeeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(FeeType)
  type: FeeType;

  @IsEnum(FeeFrequency)
  frequency: FeeFrequency;

  @IsOptional()
  @IsNumber()
  ratePerPerson?: number;

  @IsOptional()
  @IsNumber()
  minium?: number;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;
}
