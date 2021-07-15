import { Injectable, } from '@nestjs/common';
import { Company } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmCompanyService {

	constructor(
		private readonly simpleFarmHttpService: SimpleFarmHttpService
	) {

	}

	upsert(data: Company): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`Company`, data);
	}

}
