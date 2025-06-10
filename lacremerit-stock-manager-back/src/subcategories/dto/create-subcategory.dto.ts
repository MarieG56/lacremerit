import { IsString, IsInt } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  name: string;

  @IsInt()
  categoryId: number;
}