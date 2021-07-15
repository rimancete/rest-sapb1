import { Module } from '@nestjs/common';
import { DownPaymentsRequestsService } from './down-payment.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [DownPaymentsRequestsService],
  exports: [DownPaymentsRequestsService]
})

export class DownPaymentRequestsModule { }
