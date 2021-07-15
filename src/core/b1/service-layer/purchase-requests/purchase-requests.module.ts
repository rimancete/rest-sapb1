import { Module } from '@nestjs/common';
import { PurchaseRequestsService } from './purchase-requests.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [PurchaseRequestsService],
  exports: [PurchaseRequestsService]
})

export class PurchaseRequestsModule { }
