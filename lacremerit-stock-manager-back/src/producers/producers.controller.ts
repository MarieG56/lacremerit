import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producerService: ProducersService) {}

  @Post()
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producerService.create(createProducerDto);
  }

  @Get()
  findAll() {
    return this.producerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProducerDto: UpdateProducerDto) {
    return this.producerService.update(+id, updateProducerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producerService.remove(+id);
  }
}
