import { Injectable, } from '@nestjs/common';
import { Transaction } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmTransactionService {
	
	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: Transaction): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`Transaction`, data);
	}

}
