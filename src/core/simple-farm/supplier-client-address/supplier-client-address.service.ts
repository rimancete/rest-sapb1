import { Injectable, } from '@nestjs/common';
import { SupplierClientAddress } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmSupplierClientAddressService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: SupplierClientAddress): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`SupplierClientAddress`, data);
	}

}
