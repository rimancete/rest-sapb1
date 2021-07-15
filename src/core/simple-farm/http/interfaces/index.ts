
export interface HttpServiceResponse<T> {
	error?: HttpServiceError,
	data?: T
}

export interface HttpServiceError {
	code: string,
	message?: string,
	innerMessage: string
}

export enum RequestMethodType {
	"GET" = "GET",
	"POST" = "POST",
	"PATCH" = "PATCH",
	"PUT" = "PUT",
	"DELETE" = "DELETE"
}

export interface SimpleFarmResponse {
	RoutineProcessId?: number,
	NextExecution?: Date,
	Id?: number,
	ResultDate?: string,
	RoutineId?: number,
	Executed?: boolean,
	IsExecuting?: boolean,
	StartDate?: string,
	FinishDate?: string,
	HasErrors: boolean,
	Progress?: number,
	ProcessedRecords?: number,
	TotalRecords?: number,
	TotalInserts?: number,
	TotalUpdates?: number,
	TotalDeleted?: number,
	TotalWarnings?: number,
	TotalErrors?: number,
	TotalSkiped?: number,
	Result?: SimpleFarmResultResponse[],
}

export interface SimpleFarmResultResponse {
	Type?: string,
	User?: string,
	Date?: string,
	Time?: string,
	Data?: SimpleFarmDataResponse[],
	Log?: string
}

export interface SimpleFarmDataResponse {
	ErrorMessages?: string,
	Status?: number,
	CriticalError?: string
}
