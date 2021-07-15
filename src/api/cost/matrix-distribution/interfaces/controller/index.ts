import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';

export class MatrixDistribuitionMatrixRequest {

	@ApiProperty()
	costCenterCode: string;
	
	costCenterType: string;

	@ApiProperty()
	percentage: number;
}


export class MatrixDistribuitionRequest {

	@ApiProperty()
	businessPlaceCode: number;

	@ApiProperty()
	costCenterCode: string;

	costCenterType: string;
	
	@ApiProperty()
	projectCode: string;

	@ApiProperty()
	referenceDate: string;

	@ApiProperty({ type: MatrixDistribuitionMatrixRequest, isArray: true })
	distribution: MatrixDistribuitionMatrixRequest[];
}


export class MatrixDistribuitionData {

	@ApiProperty()
	journalEntryCode?: string;

}

export class MatrixDistribuitionResult implements HttpServiceResponse<MatrixDistribuitionData> {

	@ApiProperty()
	data?: MatrixDistribuitionData;

	@ApiProperty()
	error?: HttpServiceError;

}
