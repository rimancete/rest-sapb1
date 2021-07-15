import { Injectable, } from '@nestjs/common';
import { ItemFamily } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmItemFamilyService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: ItemFamily): Promise<SimpleFarmResponse> {    
		return this.simpleFarmHttpService.post(`ItemFamily`, data);
	}

}
