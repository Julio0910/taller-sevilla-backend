import { Injectable, BadRequestException } from '@nestjs/common';
// import { CreateInvoiceDto } from './dto/create-invoice.dto'; // Lo dejamos como "any" abajo para flexibilidad temporal
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  // Cambiamos el tipo a "any" para aceptar los campos nuevos sin que TypeScript se queje
  async create(createInvoiceDto: any) { 
    // Usamos $transaction: o se guarda TODO o no se guarda NADA.
    return this.prisma.$transaction(async (tx) => {
      
      // Extraemos absolutamente todos los datos que manda el Frontend
      const { paymentMethod, clientId, items, laborDesc, laborPrice, surcharge } = createInvoiceDto;

      // 1. Calculamos la matemática financiera (SOLO REPUESTOS)
      let subtotalRepuestos = 0;
      for (const item of items) {
        subtotalRepuestos += item.quantity * item.unitPrice;
      }
      
      const taxAmount = subtotalRepuestos * 0.15; // Calculamos el 15% de ISV

      // Aseguramos que la mano de obra y el recargo sean números (si vienen vacíos, valen 0)
      const manoObra = laborPrice ? Number(laborPrice) : 0;
      const recargoBanco = surcharge ? Number(surcharge) : 0;

      // Sumamos TODO para el Total General
      const totalAmount = subtotalRepuestos + taxAmount + manoObra + recargoBanco;

      // 2. Generamos un Correlativo temporal
      const invoiceNumber = `FAC-${Date.now()}`; 

      // 3. Guardamos la Factura y su Detalle al mismo tiempo
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          subtotal: subtotalRepuestos,
          taxAmount,
          totalAmount,
          paymentMethod: paymentMethod,
          clientId: clientId,
          
          // --- LOS 3 CAMPOS NUEVOS DE MANO DE OBRA Y BANCOS ---
          laborDesc: laborDesc,
          laborPrice: manoObra,
          surcharge: recargoBanco,
          
          // La magia relacional: creamos los detalles de la factura
          items: {
            create: items.map((item: any) => ({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.quantity * item.unitPrice,
              productId: item.productId,
            })),
          },
        },
        include: {
          items: true, 
        },
      });

      // 4. Descontamos el inventario (Solo si NO es un servicio)
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          throw new BadRequestException(`Producto no encontrado ID: ${item.productId}`);
        }

        // Solo validamos y restamos stock si el producto NO es un servicio
        if (product.isService === false) {
          if (product.stock < item.quantity) {
            throw new BadRequestException(`No hay suficiente stock para el producto ID: ${item.productId}`);
          }

          // Restamos el inventario físico
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }
      }

      // Si todo sale bien, devolvemos la factura terminada
      return invoice;
    });
  }

  findAll() {
    return this.prisma.invoice.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        client: true // Incluimos al cliente por si acaso lo necesitamos
      }
    });
  }

  findOne(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, client: true } 
    });
  }
}