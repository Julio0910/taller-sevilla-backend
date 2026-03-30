import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DraftsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.draft.create({
      data: {
        name: data.name,
        posState: data.posState, // Aquí se guarda todo el JSON de la pantalla
      },
    });
  }

  findAll() {
    // Los traemos ordenados por fecha, los más recientes primero
    return this.prisma.draft.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.draft.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.draft.update({
      where: { id },
      data: {
        name: data.name,
        posState: data.posState,
      },
    });
  }

  remove(id: number) {
    return this.prisma.draft.delete({ where: { id } });
  }
}