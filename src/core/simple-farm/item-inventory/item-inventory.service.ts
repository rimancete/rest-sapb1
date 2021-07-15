import { Injectable, } from '@nestjs/common';
import { ItemInventory } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmItemInventoryService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: ItemInventory): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`ItemInventory`, data);
	}

}
