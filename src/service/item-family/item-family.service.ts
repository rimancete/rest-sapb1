import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmItemFamilyService } from '../../core/simple-farm/item-family/item-family.service';
import { HanaItemFamilyService } from '../../core/b1/hana/item-family/item-family.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';

@Injectable()
export class ItemFamilyService extends Runner {

	private logger = new Logger(ItemFamilyService.name);

	constructor(
		private readonly hanaItemFamilyService: HanaItemFamilyService,
		private readonly simpleFarmItemFamilyService: SimpleFarmItemFamilyService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {
		const records = await this.hanaItemFamilyService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}


		for (const record of records) {
			try {        
				const responseObject = await this.simpleFarmItemFamilyService.upsert(record);
				await this.hanaItemFamilyService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.ITEM_FAMILY, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.ITEM_FAMILY, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}