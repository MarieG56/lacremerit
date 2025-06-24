import { IsNumber } from 'class-validator';

export class CreateOrderItemNestedDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
