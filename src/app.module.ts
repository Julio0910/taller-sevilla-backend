import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DraftsModule } from './drafts/drafts.module';
import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    CategoriesModule,
    ClientsModule,
    InvoicesModule,
    DraftsModule,
    WorkersModule, // <-- Aquí conectamos a los trabajadores al sistema principal
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}