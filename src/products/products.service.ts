import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    // Traemos todos los productos e INCLUIMOS la información de su categoría
    return this.prisma.product.findMany({
      include: {
        category: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      }
    });
  }

// Reemplaza esto dentro de products.service.ts
update(id: number, updateProductDto: UpdateProductDto) {
  return this.prisma.product.update({
    where: { id },
    data: updateProductDto,
  });
}

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}