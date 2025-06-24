import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientService, PrismaService],
  exports: [ClientService],
})
export class ClientModule {}
