import { Injectable, } from '@nestjs/common';
import { State } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmStateService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: State): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`State`, data);
	}

}
