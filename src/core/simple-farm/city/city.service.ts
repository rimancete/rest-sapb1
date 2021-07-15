import { Injectable, } from '@nestjs/common';
import { City } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmCityService{

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: City): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`City`, data);
	}

}
