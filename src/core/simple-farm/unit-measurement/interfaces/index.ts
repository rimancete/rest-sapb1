
export interface UnitMeasurement {
	Code?: string,
	Description?: string,
	UnitRole?: string,
	Converters?: UnitMeasurementConverters[]
}

export interface UnitMeasurementConverters {
	UnitCodeFrom?: string,
	UnitCodeTo?: string,
	Factor?: number
}