import { Injectable, } from '@nestjs/common';
import { MovementsStockPurchase } from './interfaces';
import { SimpleFarmHttpService } from '../http/simple-farm-http.service';
import { SimpleFarmResponse } from '../http/interfaces/index';

@Injectable()
export class SimpleFarmMovementStockPurchaseService {

	constructor(private readonly simpleFarmHttpService: SimpleFarmHttpService) {}

	upsert(data: MovementsStockPurchase): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`MovementsStockPurchase`, data);
	}

	del(data: string[]): Promise<SimpleFarmResponse> {
		return this.simpleFarmHttpService.post(`DelMovementsStockPurchase`, data);
	}



}

