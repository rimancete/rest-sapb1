import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../core/b1/service-layer/http/interfaces';


export class LogsData {

	@ApiProperty()
	Code?: string;

	@ApiProperty()
	LOGDATE?: Date;

	@ApiProperty()
	LOGTYPECODE?: number;

	@ApiProperty()
	COMPANY?: string;

	@ApiProperty()
	MODULE?: number;

	@ApiProperty()
	MESSAGE?: string;

	@ApiProperty()
	FULLMESSAGE?: string;

	@ApiProperty()
	KEY?: string;

	@ApiProperty()
	REQUESTOBJECT?: string;

	@ApiProperty()
	RESPONSEOBJECT?: string;

}

export class LogsResult implements HttpServiceResponse<LogsData> {

	@ApiProperty()
	data?: LogsData;

	@ApiProperty()
	error?: HttpServiceError;

}

export class ApiLogsData {

	@ApiProperty()
	Total?: string;

	@ApiProperty()
	Importadas?: string;

	@ApiProperty()
	NaoImportadas?: string;

	@ApiProperty()
	Percentual?: string;
}

export class ApiGraphData {

	@ApiProperty()
	Quantidade?: string;

	@ApiProperty()
	Modulo?: string;

	@ApiProperty()
	Data?: Date;
}

export class CompanyLogsData {

	@ApiProperty()
	Total?: string;

	@ApiProperty()
	Importadas?: string;

	@ApiProperty()
	NaoImportadas?: string;

	@ApiProperty()
	Percentual?: string;
}

export class CompanyLogsResult implements HttpServiceResponse<CompanyLogsData> {

	@ApiProperty()
	data?: CompanyLogsData;

	@ApiProperty()
	error?: HttpServiceError;

}

