import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsModule } from 'src/products/products.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [PrismaModule, ProductsModule, OrderModule],
  controllers: [OrderItemController],
  providers: [OrderItemService, PrismaService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
