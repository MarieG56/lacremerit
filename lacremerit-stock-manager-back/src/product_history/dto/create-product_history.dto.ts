import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateProductHistoryDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @Type(() => Date)
  @IsDate()
  weekStartDate: string;

  @IsInt()
  @Min(0)
  receivedQuantity: number;

  @IsInt()
  @Min(0)
  soldQuantity: number;

  @IsInt()
  @Min(0)
  unsoldQuantity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
