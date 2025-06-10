import { Module } from '@nestjs/common';
import { ProductHistoryService } from './product_history.service';
import { ProductHistoryController } from './product_history.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsModule } from 'src/products/products.module';
import { ProducersModule } from 'src/producers/producers.module';
import { SubcategoriesModule } from 'src/subcategories/subcategories.module';

@Module({
  imports: [PrismaModule, CategoriesModule, SubcategoriesModule, ProductsModule, ProducersModule],
  controllers: [ProductHistoryController],
  providers: [ProductHistoryService, PrismaService],
  exports: [ProductHistoryService],
})
export class ProductHistoryModule {}
