export interface PaymentCondition {
	Code: string,
	Description: string,
	ShortName: string,
	FixedDay: boolean, 
	Anticipated: boolean,
	Type: number,
	Active: boolean,
	Installments: installments[]
}

export interface installments {
	PaymentConditionCode: string,
	Sequence: number,
	PercentValue: number,
	Amount: number,
	Days: number,
	DayOfMonth: number
}