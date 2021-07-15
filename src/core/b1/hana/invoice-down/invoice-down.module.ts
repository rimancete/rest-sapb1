import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaInvoiceDownService } from './invoice-down.service';


@Module({
  imports: [DatabaseModule],
  providers: [HanaInvoiceDownService],
  exports: [HanaInvoiceDownService]
})

export class HanaInvoiceDownModule {}
