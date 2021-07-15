import { Controller, Headers, Body, Post } from '@nestjs/common';
import { MatrixDistribuitionService } from './matrix-distribution.service';
import { MatrixDistribuitionRequest, MatrixDistribuitionResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cost')
@Controller('cost')
export class MatrixDistribuitionController {

	constructor(private readonly matrixDistribuitionService: MatrixDistribuitionService) { }

	@Post('matrix-distribution')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: MatrixDistribuitionResult })
	async insertMatrixDistribuition(@Headers('token') token, @Body() request: MatrixDistribuitionRequest): Promise<MatrixDistribuitionResult> {
		return await this.matrixDistribuitionService.insertRequest(token, request);
	}

}

