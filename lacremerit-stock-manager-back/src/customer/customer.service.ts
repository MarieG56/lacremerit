import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  
  create(data: CreateCustomerDto) {
    return this.prisma.customer.create({ data });
  }

  findAll() {
    return this.prisma.customer.findMany();
  }
  
  findOne(id: number) {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCustomerDto) {
    return this.prisma.customer.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.customer.delete({ where: { id } });
  }
}
