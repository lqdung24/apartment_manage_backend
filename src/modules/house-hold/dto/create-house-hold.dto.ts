import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { HouseHoldStatus } from '@prisma/client';

export class CreateHouseHoldDto {
  @IsNumber()
  @IsNotEmpty()
  houseHoldCode: number; // số hộ khẩu

  @IsString()
  @IsNotEmpty()
  apartmentNumber: string; // số căn hộ

  @IsString()
  @IsOptional()
  buildingNumber: string; // số nhà

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  ward: string; // Xã/Phường (bắt buộc)

  @IsString()
  @IsNotEmpty()
  province: string; // Tỉnh/Thành phố
}
