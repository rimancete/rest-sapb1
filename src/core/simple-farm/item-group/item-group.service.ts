import { Injectable, } from '@nestjs/common';
import { ItemGroup } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmItemGroupService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: ItemGroup): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`ItemGroup`, data);
	}

}
