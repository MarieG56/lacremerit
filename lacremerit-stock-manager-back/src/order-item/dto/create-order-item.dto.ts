// src/order-item/dto/create-order-item.dto.ts
import { IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}