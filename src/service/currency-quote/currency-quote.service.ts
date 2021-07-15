import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmCurrencyQuoteService } from '../../core/simple-farm/currency-quote/currency-quote.service';
import { HanaCurrencyQuoteService } from '../../core/b1/hana/currency-quote/currency-quote.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';
import { Cron, CronExpression } from '@nestjs/schedule';

const currencyCodesJson = require('../../../ISOCode.json');

@Injectable()
export class CurrencyQuoteService extends Runner {

	private logger = new Logger(CurrencyQuoteService.name);

	constructor(
		private readonly hanaCurrencyQuoteService: HanaCurrencyQuoteService,
		private readonly simpleFarmCurrencyQuoteService: SimpleFarmCurrencyQuoteService,
		private readonly logsService: LogsService
	) {
		super();
	}

	@Cron(CronExpression.EVERY_6_HOURS)
	async proccess() {

		const records = await this.hanaCurrencyQuoteService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			const key = `${record.CurrencyIsoFrom}|${record["QuoteDate"]}`;

			try {
				record.Quote = parseFloat(record.Quote);
				const currencyFrom = record.CurrencyIsoFrom;
				const codeFrom = _.find(currencyCodesJson, { AlphabeticCode: record.CurrencyIsoFrom })
				record.CurrencyIsoFrom = codeFrom.NumericCode;
				const codeTo = _.find(currencyCodesJson, { AlphabeticCode: record.CurrencyIsoTo })
				record.CurrencyIsoTo = codeTo.NumericCode;

				const responseObject = await this.simpleFarmCurrencyQuoteService.upsert(record);
				await this.hanaCurrencyQuoteService.setIntegrated(currencyFrom, record["QuoteDate"]);
				this.logsService.logSuccess({
					key, module: LogModule.CURRENCY_QUOTE, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key, module: LogModule.CURRENCY_QUOTE, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}