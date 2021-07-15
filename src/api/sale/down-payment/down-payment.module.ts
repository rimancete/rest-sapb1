import { Module } from '@nestjs/common';
import { DownPaymentsService } from './down-payment.service';
import { DownPaymentsController } from './down-payment.controller';
import { HanaDownPaymentModule } from '../../../core/b1/hana/down-payment/down-payment.module';
import { DownPaymentRequestsModule } from '../../../core/b1/service-layer/down-payment/down-payment.module';
import {HanaSaleModule} from '../../../core/b1/hana/sale/sale.module'
import { LogsModule } from '../../../core/logs/logs.module';

@Module({
	imports: [HanaDownPaymentModule, DownPaymentRequestsModule, HanaSaleModule, LogsModule],
	providers: [DownPaymentsService],
	controllers: [DownPaymentsController]
})
export class DownPaymentsModule { }
