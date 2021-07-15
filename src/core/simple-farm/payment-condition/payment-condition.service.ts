import { Injectable, } from '@nestjs/common';
import { PaymentCondition } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmPaymentConditionService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	async upsert(data: PaymentCondition): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`PaymentCondition`, data);
	}

}
