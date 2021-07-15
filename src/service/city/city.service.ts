import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmCityService } from '../../core/simple-farm/city/city.service';
import { HanaCityService } from '../../core/b1/hana/city/city.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';

@Injectable()
export class CityService extends Runner {

	private logger = new Logger(CityService.name);

	constructor(
		private readonly hanaCityService: HanaCityService,
		private readonly simpleFarmCityService: SimpleFarmCityService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		const records = await this.hanaCityService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
				const responseObject = await this.simpleFarmCityService.upsert(record);
				await this.hanaCityService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.CITY, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.CITY, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}