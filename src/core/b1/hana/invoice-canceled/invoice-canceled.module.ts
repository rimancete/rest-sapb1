import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaInvoiceCanceledService } from './invoice-canceled.service';


@Module({
  imports: [DatabaseModule],
  providers: [HanaInvoiceCanceledService],
  exports: [HanaInvoiceCanceledService]
})

export class HanaInvoiceCanceledModule {}
