import { Injectable, } from '@nestjs/common';
import { ItemPrice } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmItemPriceService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: ItemPrice): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`ItemPrice`, data);
	}

}
