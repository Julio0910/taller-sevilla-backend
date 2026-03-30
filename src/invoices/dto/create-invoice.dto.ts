// Este es el molde para cada producto individual que va en la factura
export class CreateInvoiceItemDto {
  productId: number;
  quantity: number;
  unitPrice: number; // El precio al que se le vendió en ese momento
}

// Este es el molde principal de la Factura
export class CreateInvoiceDto {
  clientId?: number;       // Opcional, si es consumidor final va vacío
  paymentMethod: string;   // "Efectivo", "Tarjeta", "Transferencia"
  items: CreateInvoiceItemDto[]; // El arreglo con la lista de productos
}