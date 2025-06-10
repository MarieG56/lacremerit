import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductHistoryService } from './product_history.service';
import { CreateProductHistoryDto } from './dto/create-product_history.dto';
import { UpdateProductHistoryDto } from './dto/update-product_history.dto';

@Controller('product-history')
export class ProductHistoryController {
  constructor(private readonly service: ProductHistoryService) {}

  @Post()
  create(@Body() dto: CreateProductHistoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductHistoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
