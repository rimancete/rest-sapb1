import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmInventoryLocationService } from '../../core/simple-farm/inventory-location/inventory-location.service';
import { HanaInventoryLocationService } from '../../core/b1/hana/inventory-location/inventory-location.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';

@Injectable()
export class InventoryLocationService extends Runner {

	private logger = new Logger(InventoryLocationService.name);

	constructor(
		private readonly hanaInventoryLocationService: HanaInventoryLocationService,
		private readonly simpleFarmInventoryLocationService: SimpleFarmInventoryLocationService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {
		const records = await this.hanaInventoryLocationService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			record["CompanySubsidiaries"] = JSON.parse(record["CompanySubsidiaries"]);
			record["ShortName"] = record["ShortName"] ? record["ShortName"].substring(0, 20) : '';
			record["Description"] = record["Description"] ? record["Description"].substring(0, 20) : '';
			try {
				const responseObject = await this.simpleFarmInventoryLocationService.upsert(record);
				await this.hanaInventoryLocationService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.INVENTORY_LOCATION, requestObject: record, responseObject
				});
			}
			catch (exception) {
        
        this.logsService.logError({ key: record.Code, module: LogModule.INVENTORY_LOCATION, exception });        
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}


