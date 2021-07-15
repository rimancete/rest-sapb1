import { Module } from '@nestjs/common';
import { SimpleFarmCurrencyService } from './currency.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmCurrencyService],
	exports: [SimpleFarmCurrencyService]
})

export class SimpleFarmCurrencyModule { }
