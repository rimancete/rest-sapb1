import { Module } from '@nestjs/common';
import { CurrencyCategoryService } from './currency-category.service';
import { SimpleFarmCurrencyCategoryModule } from '../../core/simple-farm/currency-category/currency-category.module';
import { HanaCurrencyCategoryModule } from '../../core/b1/hana/currency-category/currency-category.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaCurrencyCategoryModule, SimpleFarmCurrencyCategoryModule, LogsModule],
	providers: [CurrencyCategoryService],
	exports: [CurrencyCategoryService],
})
export class CurrencyCategoryModule { }
