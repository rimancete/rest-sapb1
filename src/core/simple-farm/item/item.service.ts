import { Injectable, } from '@nestjs/common';
import { Item } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmItemService  {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: Item): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`Item`, data);
	}

}
