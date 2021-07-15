import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmUnitMeasurementService } from '../../core/simple-farm/unit-measurement/unit-measurement.service';
import { HanaUnitMeasurementService } from '../../core/b1/hana/unit-measurement/unit-measurement.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';

@Injectable()
export class UnitMeasurementService extends Runner {

	private logger = new Logger(UnitMeasurementService.name);

	constructor(
		private readonly simpleFarmUnitMeasurementService: SimpleFarmUnitMeasurementService,
		private readonly hanaUnitMeasurementService: HanaUnitMeasurementService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		const records = await this.hanaUnitMeasurementService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
				const responseObject = await this.simpleFarmUnitMeasurementService.upsert(record);
				await this.hanaUnitMeasurementService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.UNIT_MEASUREMENT, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.UNIT_MEASUREMENT, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}