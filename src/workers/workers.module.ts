import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // <-- Conectamos la base de datos
  controllers: [WorkersController],
  providers: [WorkersService],
})
export class WorkersModule {}