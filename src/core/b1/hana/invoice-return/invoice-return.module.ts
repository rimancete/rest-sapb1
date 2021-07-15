import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaInvoiceReturnService } from './invoice-return.service';


@Module({
  imports: [DatabaseModule],
  providers: [HanaInvoiceReturnService],
  exports: [HanaInvoiceReturnService]
})

export class HanaInvoiceReturnModule {}
