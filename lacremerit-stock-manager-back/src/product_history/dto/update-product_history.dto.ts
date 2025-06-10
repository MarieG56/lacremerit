import { PartialType } from '@nestjs/mapped-types';
import { CreateProductHistoryDto } from './create-product_history.dto';
import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class UpdateProductHistoryDto extends PartialType(CreateProductHistoryDto) {
    @IsOptional()
    @IsInt()
    @IsPositive()
    productId?: number;
  
    @IsOptional()
    @IsDateString()
    weekStartDate?: string;
  
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
