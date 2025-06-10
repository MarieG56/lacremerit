import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProducersModule } from 'src/producers/producers.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProducersModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
