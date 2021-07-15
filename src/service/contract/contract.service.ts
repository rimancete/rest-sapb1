import { Injectable, Logger } from '@nestjs/common';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';
import { HanaContractService } from 'src/core/b1/hana/contract/contract.service';
import { SimpleFarmContractService } from 'src/core/simple-farm/contract/contract.service';

@Injectable()
export class ContractService extends Runner {

	private logger = new Logger(ContractService.name);

	constructor(
		private readonly hanaContractService: HanaContractService,
		private readonly simpleFarmContractService: SimpleFarmContractService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		const records = await this.hanaContractService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
        this.logger.log(`Company Record.. ${JSON.stringify(record)}`)
				const rawItens = await this.hanaContractService.getNotIntegratedItems(record.AbsID);
				const itens = rawItens.map(item => {
					return {
						AgricuturalOperation: (item.U_ALFA_Operation ? item.U_ALFA_Operatio : 0),
						PointingUnit: (item.U_ALFA_FlowRate ? item.U_ALFA_FlowRate : 0) ,
            UnitaryValue: item.UnitPrice,
            DateContract: item.SignDate,
            EstimatedQtd: item.PlanQty
					}
				});
				const recordData = {
          Type: record.Type,
					Code: record.AbsID,
					CompanyCode: record.BPLId,
					StartDate: record.StartDate,
					EndDate: record.EndDate,
					Status: 1,
					ProviderCode: record.BpCode,
					Remark: record.Remarks,
					Items: itens
        }
        
        const responseObject = await this.simpleFarmContractService.upsert(recordData);
        
				await this.hanaContractService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.CONTRACT, requestObject: recordData, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.AbsID, module: LogModule.CONTRACT, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}