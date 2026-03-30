import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto hace que Prisma esté disponible en todo el proyecto sin tener que importarlo en cada módulo nuevo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Aquí lo hacemos público
})
export class PrismaModule {}