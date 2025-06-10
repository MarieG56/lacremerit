import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    return this.prisma.subcategory.create({
      data: {
        name: createSubcategoryDto.name,
        categoryId: createSubcategoryDto.categoryId, 
      },
    });
  }

  async findAll() {
    return this.prisma.subcategory.findMany();
  }

  async findOne(id: number) {
    return this.prisma.subcategory.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.prisma.subcategory.update({
      where: { id },
      data: {
        name: updateSubcategoryDto.name,
        categoryId: updateSubcategoryDto.categoryId, 
      },
    });
  }

  async remove(id: number) {
    return this.prisma.subcategory.delete({
      where: { id },
    });
  }
}
