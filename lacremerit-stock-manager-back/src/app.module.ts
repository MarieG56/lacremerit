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
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CategoriesModule, SubcategoriesModule, ProductsModule, ProducersModule, ProductHistoryModule, PrismaModule, OrderModule, CustomerModule, OrderItemModule, ClientModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
