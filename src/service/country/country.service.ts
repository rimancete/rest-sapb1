import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmCountryService } from '../../core/simple-farm/country/country.service';
import { HanaCountryService } from '../../core/b1/hana/country/country.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';

import * as _ from 'lodash';

@Injectable()
export class CountryService extends Runner {

	private logger = new Logger(CountryService.name);

	constructor(
		private readonly hanaCountryService: HanaCountryService,
		private readonly simpleFarmCountryService: SimpleFarmCountryService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		const records = await this.hanaCountryService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
				const responseObject = await this.simpleFarmCountryService.upsert(record);
				await this.hanaCountryService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.COUNTRY, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.COUNTRY, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}