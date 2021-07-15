import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';

export class HarvestReportRequest {

	@ApiProperty()
	businessPlaceCode: number;

	@ApiProperty()
	projectCode: string;

	@ApiProperty()
	referenceDate: string;

	@ApiProperty()
	plantation: number;

	@ApiProperty()
	harvest: number;

	@ApiProperty()
	reference: string;

	@ApiProperty()
	itemCode: string;
	
	itemCostCenters: string[];
	
	itemAppropriationAccount: string;

	itemAppropriationCostCenter: string;

}


export class HarvestReportData {

	@ApiProperty()
	journalEntryCode?: string;

	@ApiProperty()
	MaterialRevaluationCode?: string;

}

export class HarvestReportResult implements HttpServiceResponse<HarvestReportData> {

	@ApiProperty()
	data?: HarvestReportData;

	@ApiProperty()
	error?: HttpServiceError;

}


