import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Unit } from '../unit.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Unit)
  unit: Unit;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  @IsOptional()
  subcategoryId?: number;

  @IsNumber()
  producerId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
