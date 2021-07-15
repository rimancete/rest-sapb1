import { Injectable, } from '@nestjs/common';
import { CostCenter } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmCostCenterService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: CostCenter): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`CostCenter`, data);
	}

}
