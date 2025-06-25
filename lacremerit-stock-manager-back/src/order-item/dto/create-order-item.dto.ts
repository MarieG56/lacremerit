// src/order-item/dto/create-order-item.dto.ts
import { IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  quantity: number;

  @IsNumber()
  unitPrice: number;
}