import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        subcategory: true,
        producer: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        subcategory: true,
        producer: true,
      },
    });
  }

  update(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id: Number(id) },
      data,
    });
  }

  async remove(id: number) {
    await this.prisma.productHistory.deleteMany({
      where: { productId: Number(id) },
    });

    return this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }

  async findLowStockActiveProducts() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        unit: true,
      },
    });
  }
}
