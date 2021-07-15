import { Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmPaymentConditionService } from './payment-condition.service';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmPaymentConditionService],
	exports: [SimpleFarmPaymentConditionService]
})

export class SimpleFarmPaymentConditionModule { }
