import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmCompanySubsidiaryService } from '../../core/simple-farm/company-subsidiary/company-subsidiary.service';
import { HanaBranchService } from '../../core/b1/hana/branch/branch.service'
import { LogsService } from '../../core/logs/logs.service'
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';

@Injectable()
export class BranchService extends Runner {

	private logger = new Logger(BranchService.name);

	constructor(
		private readonly simpleFarmCompanySubsidiaryService: SimpleFarmCompanySubsidiaryService,
		private readonly hanaBranchservice: HanaBranchService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {
		const records = await this.hanaBranchservice.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
        console.log('branch',record)
				const responseObject = await this.simpleFarmCompanySubsidiaryService.upsert(record);
				await this.hanaBranchservice.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.BRANCH, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.BRANCH, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}