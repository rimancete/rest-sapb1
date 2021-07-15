import { Module } from '@nestjs/common';
import { SimpleFarmCityModule } from '../../core/simple-farm/city/city.module';
import { HanaCityModule } from '../../core/b1/hana/city/city.module'
import { LogsModule } from '../../core/logs/logs.module';
import { PaymentConditionService } from './payment-condition.service';
import { HanaPaymentConditionModule } from 'src/core/b1/hana/payment-condition/payment-condition.module';
import { SimpleFarmPaymentConditionModule } from 'src/core/simple-farm/payment-condition/payment-condition.module';

@Module({
	imports: [HanaPaymentConditionModule, SimpleFarmPaymentConditionModule, LogsModule],
	providers: [PaymentConditionService],
	exports: [PaymentConditionService],
})
export class PaymentConditionModule { }
