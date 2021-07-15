import { Injectable, } from '@nestjs/common';
import { UnitMeasurement } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmUnitMeasurementService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: UnitMeasurement): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`UnitMeasurement`, data);
	}

}
