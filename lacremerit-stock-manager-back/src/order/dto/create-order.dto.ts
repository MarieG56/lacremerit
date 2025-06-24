import { IsArray, ValidateNested, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';
import { CreateOrderItemNestedDto } from './create-order-item-nested.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemNestedDto)
  orderItems?: CreateOrderItemNestedDto[];
}
