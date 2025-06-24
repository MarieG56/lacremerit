import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderItemDto) {
    const orderItem = await this.prisma.orderItem.create({
      data,
      include: {
        order: true,
        product: true,
      },
    });
    await this.updateOrderTotalAmount(orderItem.orderId);
    return orderItem;
  }

  findAll() {
    return this.prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });
  }

  async update(id: number, data: UpdateOrderItemDto) {
    try {
      const orderItem = await this.prisma.orderItem.update({
        where: { id },
        data,
        include: {
          order: true,
          product: true,
        },
      });
      await this.updateOrderTotalAmount(orderItem.orderId);
      return orderItem;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`OrderItem with id ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const orderItem = await this.prisma.orderItem.findUnique({ where: { id } });
    const deleted = await this.prisma.orderItem.delete({
      where: { id },
    });
    if (orderItem) {
      await this.updateOrderTotalAmount(orderItem.orderId);
    }
    return deleted;
  }

  private async updateOrderTotalAmount(orderId: number) {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
    });
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount },
    });
  }
}
