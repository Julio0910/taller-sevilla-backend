export class CreateProductDto {
  barcode?: string;      // Opcional, para escanear con la pistola
  name: string;          // Ej: "Aceite Castrol 20W-50"
  description?: string;
  costPrice: number;     // Cuánto te costó
  salePrice: number;     // A cuánto lo vendes en el taller
  stock?: number;        // Cantidad inicial (por defecto será 0 si no se envía)
  minStock?: number;     // El disparador de la alerta (por defecto 5)
  isService?: boolean;
  categoryId: number;    // ¡El enlace! Aquí pondremos el ID "1" de Lubricantes
}