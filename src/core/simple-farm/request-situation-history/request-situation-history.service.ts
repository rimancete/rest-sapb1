import { Injectable, } from '@nestjs/common';
import { RequestSituationHistory } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmRequestSituationHistoryService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: RequestSituationHistory): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`RequestSituationHistory`, data);
	}

}

