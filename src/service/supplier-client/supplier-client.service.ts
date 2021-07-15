import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmSupplierClientService } from '../../core/simple-farm/supplier-client/supplier-client.service';
import { HanaBusinessPartnersService } from '../../core/b1/hana/business-partners/business-partners.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';
import { ItemGroupService } from '../item-group/item-group.service';

@Injectable()
export class SupplierClientService extends Runner {

	private logger = new Logger(SupplierClientService.name);

	constructor(
		private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
		private readonly simpleFarmSupplierClientService: SimpleFarmSupplierClientService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		let records = await this.hanaBusinessPartnersService.getNotIntegrated();
		records = records.filter(r => _.isInteger(_.parseInt(r.Code)));

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
        
        const adrs = await this.hanaBusinessPartnersService.getAllAdress(record.Code);
        record.Addresses = adrs;
				const responseObject = await this.simpleFarmSupplierClientService.upsert(record);
				await this.hanaBusinessPartnersService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.SUPLIER_CLIENT, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.SUPLIER_CLIENT, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}