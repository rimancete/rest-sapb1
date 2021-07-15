import { Injectable, Logger } from '@nestjs/common';
import { CurrencyCategory } from '../../core/simple-farm/currency-category/interfaces';
import { SimpleFarmCurrencyCategoryService } from '../../core/simple-farm/currency-category/currency-category.service';
import { HanaCurrencyCategoryService } from '../../core/b1/hana/currency-category/currency-category.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';

@Injectable()
export class CurrencyCategoryService extends Runner {

	private logger = new Logger(CurrencyCategoryService.name);

	constructor(
		private readonly hanaCurrencyCategoryService: HanaCurrencyCategoryService,
		private readonly simpleFarmCurrencyCategoryService: SimpleFarmCurrencyCategoryService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		const records = await this.hanaCurrencyCategoryService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found 1 records to integrate...`)
		}

		if (records && records.length > 0) {
			try {
				const category: CurrencyCategory = {
					Code: "GER",
					Description: "Geral",
					ShortName: "Geral",
					Currencies: records.map(r => { return { Symbol: r["Symbol"] } })
				};
				const responseObject = await this.simpleFarmCurrencyCategoryService.upsert(category);
				await this.hanaCurrencyCategoryService.setIntegrated();
				this.logsService.logSuccess({
					key: 'GER', module: LogModule.CURRENCY_CATEGORY, requestObject: category, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: 'GER', module: LogModule.CURRENCY_CATEGORY, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}