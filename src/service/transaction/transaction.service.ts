import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmTransactionService } from '../../core/simple-farm/transaction/transaction.service';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';

@Injectable()
export class TransactionService extends Runner {

	private logger = new Logger(TransactionService.name);

	constructor(
		private readonly simpleFarmTransactionService: SimpleFarmTransactionService
	) {
		super();
	}

	async proccess() {

		const record = {
			Code: "",
			Description: "",
			ShortName: "",
			ParentCode: "", //optional
			TransactionType: 1, // 1 or 2 
			Active: true //optional
		}

		const responseObj = await this.simpleFarmTransactionService.upsert(record);

		if(responseObj && responseObj.RoutineId){
			this.logger.log(`Finished integration...`)
		}
	}
}