import { Injectable, } from '@nestjs/common';
import { Country } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmCountryService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: Country): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`Country`, data);
	}

}
