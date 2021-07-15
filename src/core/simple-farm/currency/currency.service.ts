import { Injectable, } from '@nestjs/common';
import { Currency } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmCurrencyService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: Currency): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`Currency`, data);
	}

}
