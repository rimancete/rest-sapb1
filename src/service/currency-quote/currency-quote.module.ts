import { Module } from '@nestjs/common';
import { CurrencyQuoteService } from './currency-quote.service';
import { SimpleFarmCurrencyQuoteModule } from '../../core/simple-farm/currency-quote/currency-quote.module';
import { HanaCurrencyQuoteModule } from '../../core/b1/hana/currency-quote/currency-quote.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaCurrencyQuoteModule, SimpleFarmCurrencyQuoteModule, LogsModule],
	providers: [CurrencyQuoteService],
	exports: [CurrencyQuoteService],
})
export class CurrencyQuoteModule { }
