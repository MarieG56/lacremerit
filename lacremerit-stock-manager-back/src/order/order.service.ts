import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto) {
    const { customerId, clientId, orderItems, orderDate, status, totalAmount } = data;

    if ((!customerId && !clientId) || (customerId && clientId)) {
      throw new BadRequestException(
        'Une commande doit être liée soit à un client particulier (customerId), soit à un client professionnel (clientId), mais pas les deux.'
      );
    }

    return this.prisma.order.create({
      data: {
        ...(customerId && { customer: { connect: { id: customerId } } }),
        ...(clientId && { client: { connect: { id: clientId } } }),
        orderDate: new Date(orderDate ?? Date.now()),
        status,
        totalAmount,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
        customer: true,
        client: true,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        client: true,
        orderItems: {
          include: {
            product: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        client: true,
        orderItems: true,
      },
    });
  }

  update(id: number, data: UpdateOrderDto) {
    const { customerId, clientId, orderItems, ...rest } = data;

    // Validation : un seul des deux doit être renseigné (si présents)
    if (
      (customerId && clientId) ||
      (customerId === null && clientId === null)
    ) {
      throw new BadRequestException(
        'Une commande doit être liée soit à un client particulier (customerId), soit à un client professionnel (clientId), mais pas les deux.'
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        ...rest,
        ...(customerId && { customer: { connect: { id: customerId } } }),
        ...(clientId && { client: { connect: { id: clientId } } }),
      },
      include: {
        customer: true,
        client: true,
        orderItems: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
