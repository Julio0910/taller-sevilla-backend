import { Module } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // <-- Importamos Prisma para hablar con la base de datos
  controllers: [DraftsController],
  providers: [DraftsService],
})
export class DraftsModule {}