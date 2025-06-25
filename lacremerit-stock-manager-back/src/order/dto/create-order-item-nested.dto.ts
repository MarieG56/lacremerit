import { IsNumber } from 'class-validator';

export class CreateOrderItemNestedDto {
  @IsNumber()
  productId: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
