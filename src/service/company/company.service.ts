import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmCompanyService } from '../../core/simple-farm/company/company.service';
import { HanaCompanyService } from '../../core/b1/hana/company/company.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';

@Injectable()
export class CompanyService extends Runner {
	constructor(
		private readonly simpleFarmCompanyService: SimpleFarmCompanyService,
		private readonly hanaCompanyService: HanaCompanyService,
		private readonly logsService: LogsService
	) {
		super();
		this.maxRunners = 1;
	}

	private logger = new Logger(CompanyService.name);

	async proccess() {

		const records = await this.hanaCompanyService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {

			try {
        
        const responseObject = await this.simpleFarmCompanyService.upsert(record);

				await this.hanaCompanyService.setIntegrated(record);

				this.logsService.logSuccess({
					key: record.Code, module: LogModule.COMPANY, requestObject: record, responseObject
				});

			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.COMPANY, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}