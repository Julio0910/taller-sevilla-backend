import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkersService } from './workers.service';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  // --- RUTAS PARA TRABAJADORES ---
  @Post()
  create(@Body() createWorkerDto: any) {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  findAll() {
    return this.workersService.findAll();
  }

  // IMPORTANTE: Esta ruta debe ir ANTES de /:id para que no se confunda
  @Get('jobs')
  findAllJobs() {
    return this.workersService.getAllJobs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkerDto: any) {
    return this.workersService.update(+id, updateWorkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workersService.remove(+id);
  }

  // --- RUTAS PARA LOS TRABAJOS ---
  @Post(':id/jobs')
  addJob(@Param('id') id: string, @Body() jobData: any) {
    return this.workersService.addJob(+id, jobData);
  }

  @Delete('jobs/:jobId')
  removeJob(@Param('jobId') jobId: string) {
    return this.workersService.removeJob(+jobId);
  }
}