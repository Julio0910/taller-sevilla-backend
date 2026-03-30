import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  // --- GESTIÓN DE TRABAJADORES ---
  create(data: any) {
    return this.prisma.worker.create({ data });
  }

  findAll() {
    return this.prisma.worker.findMany({ 
      include: { jobs: true } // Traemos al trabajador con todo su historial de trabajos
    });
  }

  findOne(id: number) {
    return this.prisma.worker.findUnique({ 
      where: { id }, 
      include: { jobs: true } 
    });
  }

  update(id: number, data: any) {
    return this.prisma.worker.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.worker.delete({ where: { id } });
  }

  // --- GESTIÓN DE TRABAJOS Y COMISIONES ---
  addJob(workerId: number, data: any) {
    return this.prisma.workerJob.create({
      data: {
        workerId: workerId,
        description: data.description,
        jobValue: data.jobValue,     // Dinero total del trabajo
        workerCut: data.workerCut,   // Comisión del mecánico
        isOutside: data.isOutside,   // ¿Fue afuera del taller?
      }
    });
  }

  getAllJobs() {
    return this.prisma.workerJob.findMany({
      include: { worker: true },
      orderBy: { createdAt: 'desc' } // Los más recientes primero
    });
  }

  removeJob(jobId: number) {
    return this.prisma.workerJob.delete({ where: { id: jobId } });
  }
}