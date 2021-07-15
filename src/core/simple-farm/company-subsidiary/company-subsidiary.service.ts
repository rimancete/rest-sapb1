import { Injectable, } from '@nestjs/common';
import { CompanySubsidiary } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmCompanySubsidiaryService {
	
	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: CompanySubsidiary): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`CompanySubsidiary`, data);
	}

}
