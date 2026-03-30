export class CreateClientDto {
  name: string;
  rtn?: string;      // Opcional, porque a veces es "Consumidor Final"
  email?: string;
  phone?: string;
  address?: string;
}