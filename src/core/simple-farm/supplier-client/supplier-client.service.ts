import { Injectable, } from '@nestjs/common';
import { SupplierClient } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { HttpServiceResponse, SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmSupplierClientService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: any): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`SupplierClient`, data);
	}

}
