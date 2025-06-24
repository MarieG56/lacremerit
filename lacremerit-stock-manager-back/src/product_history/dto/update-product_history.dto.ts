import { PartialType } from '@nestjs/mapped-types';
import { CreateProductHistoryDto } from './create-product_history.dto';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductHistoryDto extends PartialType(
  CreateProductHistoryDto,
) {
  @IsOptional()
  @IsInt()
  @IsPositive()
  productId?: number;

  @Type(() => Date)
  @IsDate()
  weekStartDate: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  receivedQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  soldQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  unsoldQuantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
