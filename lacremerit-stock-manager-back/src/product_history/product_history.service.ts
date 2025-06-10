import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductHistoryDto } from './dto/create-product_history.dto';
import { UpdateProductHistoryDto } from './dto/update-product_history.dto';

@Injectable()
export class ProductHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductHistoryDto) {
    return this.prisma.productHistory.create({ data: dto });
  }

  async findAll() {
    return this.prisma.productHistory.findMany({
      include: { product: true },
    });
  }

  async findOne(id: number) {
    const history = await this.prisma.productHistory.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!history) {
      throw new NotFoundException('ProductHistory not found');
    }
    return history;
  }

  async update(id: number, dto: UpdateProductHistoryDto) {
    await this.findOne(id); 
    return this.prisma.productHistory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.productHistory.delete({ where: { id } });
  }
}
