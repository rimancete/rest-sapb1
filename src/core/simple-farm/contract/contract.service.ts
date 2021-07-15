import { Injectable, } from '@nestjs/common';
import { Contract } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmContractService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) { }

	async upsert(data: Contract): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`contract`, data);
	}

}
