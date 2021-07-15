import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { SimpleFarmCurrencyModule } from '../../core/simple-farm/currency/currency.module';
import { HanaCurrencyModule } from '../../core/b1/hana/currency/currency.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaCurrencyModule, SimpleFarmCurrencyModule, LogsModule],
	providers: [CurrencyService],
	exports: [CurrencyService],
})
export class CurrencyModule { }
