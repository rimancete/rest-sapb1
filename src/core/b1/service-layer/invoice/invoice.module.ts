import { Module } from '@nestjs/common';
import { ServiceLayerInvoiceService } from './invoice.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [ServiceLayerInvoiceService],
  exports: [ServiceLayerInvoiceService]
})

export class ServiceLayerInvoiceModule { }
