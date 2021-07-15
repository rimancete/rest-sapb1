import { Injectable, } from '@nestjs/common';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';
import { Batch } from './interfaces';

@Injectable()
export class SimpleFarmBatchService{

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: Batch): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`batch`, data);
	}

}
