import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  // Inyectamos nuestro PrismaService para poder hablar con PostgreSQL
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    // Guarda una nueva categoría en la base de datos
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    // Trae todas las categorías
    return this.prisma.category.findMany();
  }

  findOne(id: number) {
    // Trae una sola categoría por su ID
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Actualiza una categoría existente
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    // Elimina una categoría
    return this.prisma.category.delete({
      where: { id },
    });
  }
}