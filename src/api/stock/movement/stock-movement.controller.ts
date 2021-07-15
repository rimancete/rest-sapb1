import { Controller, Headers, Body, Post } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service'
import { StockMovementRequest, StockMovementResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Stock')
@Controller('stock')
export class StockMovementController {

	constructor(private readonly stockMovementService: StockMovementService) { }

	@Post('movement')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: StockMovementResult })
	async insertMovement(@Headers('token') token, @Body() movementRequest: StockMovementRequest): Promise<StockMovementResult> {
		return await this.stockMovementService.insertMovement(token, movementRequest);
	}

}

