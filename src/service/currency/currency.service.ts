import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmCurrencyService } from '../../core/simple-farm/currency/currency.service';
import { HanaCurrencyService } from '../../core/b1/hana/currency/currency.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';

const currencyCodesJson = require('../../../ISOCode.json');

@Injectable()
export class CurrencyService extends Runner {

	private logger = new Logger(CurrencyService.name);

	constructor(
		private readonly hanaCurrencyService: HanaCurrencyService,
		private readonly simpleFarmCurrencyService: SimpleFarmCurrencyService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

    const records = await this.hanaCurrencyService.getNotIntegrated();
    

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {

			const code = _.find(currencyCodesJson, { AlphabeticCode: record.ISOCode })
			record.ISOCode = code.NumericCode; 
			// record.Active = record.Active == "Y" ? true : false;
      
			try {
        // this.logger.log(`Oh a antes.. ${JSON.stringify(record)}`)
        const responseObject = await this.simpleFarmCurrencyService.upsert(record);
				await this.hanaCurrencyService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Symbol, module: LogModule.CURRENCY, requestObject: record, responseObject
				});
			}
			catch (exception) {
        
				this.logsService.logError({ key: record.Symbol, module: LogModule.CURRENCY, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}



