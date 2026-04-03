import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: any) { 
    return this.prisma.$transaction(async (tx) => {
      
      // 1. Extraemos TODO, incluyendo el impuesto y el número que manda el Frontend
      const { paymentMethod, clientId, items, laborDesc, laborPrice, surcharge, taxAmount: frontendTax, invoiceNumber: frontendInvoiceNumber } = createInvoiceDto;

      let subtotalRepuestos = 0;
      for (const item of items) {
        subtotalRepuestos += item.quantity * item.unitPrice;
      }
      
      // --- LA MAGIA INTELIGENTE AQUÍ ---
      // Si el frontend nos manda un impuesto explícito (como un 0), lo usamos. 
      // Si viene vacío (como en la caja vieja), le sacamos el 15% automáticamente.
      const taxAmount = frontendTax !== undefined ? Number(frontendTax) : subtotalRepuestos * 0.15;

      // Si el frontend manda un prefijo (ej. 'INT-123...'), lo usamos. Si no, le ponemos 'FAC-'
      const invoiceNumber = frontendInvoiceNumber ? frontendInvoiceNumber : `FAC-${Date.now()}`; 
      // ---------------------------------

      const manoObra = laborPrice ? Number(laborPrice) : 0;
      const recargoBanco = surcharge ? Number(surcharge) : 0;

      // Sumamos con el impuesto inteligente que calculamos arriba
      const totalAmount = subtotalRepuestos + taxAmount + manoObra + recargoBanco;

      // Guardamos la Factura
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          subtotal: subtotalRepuestos,
          taxAmount,
          totalAmount,
          paymentMethod: paymentMethod,
          clientId: clientId,
          laborDesc: laborDesc,
          laborPrice: manoObra,
          surcharge: recargoBanco,
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

      // Descontamos el inventario
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          throw new BadRequestException(`Producto no encontrado ID: ${item.productId}`);
        }

        if (product.isService === false) {
          if (product.stock < item.quantity) {
            throw new BadRequestException(`No hay suficiente stock para el producto ID: ${item.productId}`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }
      }

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
        client: true 
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