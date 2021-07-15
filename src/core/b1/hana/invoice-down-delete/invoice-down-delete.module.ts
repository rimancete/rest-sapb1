import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaInvoiceDownDeleteService } from './invoice-down-delete.service';


@Module({
  imports: [DatabaseModule],
  providers: [HanaInvoiceDownDeleteService],
  exports: [HanaInvoiceDownDeleteService]
})

export class HanaInvoiceDownDeleteModule {}
