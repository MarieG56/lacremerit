import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService],
  exports: [CustomerService],
})
export class CustomerModule {}
