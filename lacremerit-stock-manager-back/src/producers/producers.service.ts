import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProducerDto) {
    return this.prisma.producer.create({ data });
  }

  findAll() {
    return this.prisma.producer.findMany();
  }

  findOne(id: number) {
    return this.prisma.producer.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateProducerDto) {
    return this.prisma.producer.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.producer.delete({ where: { id } });
  }
}