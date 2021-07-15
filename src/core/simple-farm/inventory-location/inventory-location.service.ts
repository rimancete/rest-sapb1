import { Injectable } from '@nestjs/common';
import { InventoryLocation } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmInventoryLocationService  {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: InventoryLocation): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`InventoryLocation`, data);
	}

}
