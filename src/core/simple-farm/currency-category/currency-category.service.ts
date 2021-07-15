import { Injectable, } from '@nestjs/common';
import { CurrencyCategory } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmCurrencyCategoryService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: CurrencyCategory): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`CurrencyCategory`, data);
	}

}
