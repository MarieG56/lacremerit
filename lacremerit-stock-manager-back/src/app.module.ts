import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { ProducersModule } from './producers/producers.module';
import { ProductHistoryModule } from './product_history/product_history.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [CategoriesModule, SubcategoriesModule, ProductsModule, ProducersModule, ProductHistoryModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
