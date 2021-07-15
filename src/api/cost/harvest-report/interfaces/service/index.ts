import { HarvestReportRequest, HarvestReportData } from "../controller";
import { JournalEntryDocument } from "../../../../../core/b1/service-layer/journal-entries/interfaces";
import { MaterialRevaluation } from "../../../../../core/b1/service-layer/material-revaluation/interfaces";
import { Log } from '../../../../../core/b1/hana/log/intefaces'
import * as _ from 'lodash';

const From = (request: HarvestReportRequest): Document => {
	const data = new Date(request.referenceDate)
	// const entity: JournalEntryDocument = {
	// 	ProjectCode: request.projectCode,
	// 	Harvest: request.harvest.quantity,
	// 	Plantation: request.plantation.quantity,
	// 	JournalEntryLines: [{
	// 		DueDate: data,
	// 		BPLID: request.businessPlaceCode.toString(),
	// 		CostingCode: request.harvest.costCenterCode,
	// 		Type: 'harvest'
	// 	},
	// 	{
	// 		DueDate: data,
	// 		BPLID: request.businessPlaceCode.toString(),
	// 		CostingCode: request.plantation.costCenterCode,
	// 		Type: 'plantation'
	// 	}
	// 	]
	// };

	return null;

}

const To = (result: any): HarvestReportData => {

	const entity: HarvestReportData = {
		journalEntryCode: result.DocEntry
	};

	return entity;

	// return null;

}

const FromEntrie = (result: Document, request: HarvestReportRequest): MaterialRevaluation => {

	// const value = _.first(result.JournalEntryLines).Debit > 0 ? _.first(result.JournalEntryLines).Debit : _.first(result.JournalEntryLines).Credit;
	// const data = new Date(request.referenceDate);
	// const entity: MaterialRevaluation = {
	// 	DocDate: data.toLocaleDateString(),
	// 	RevalType: "P",
	// 	DataSource: "I",
	// 	MaterialRevaluationLines: [{
	// 		ItemCode: request.itemCode,
	// 		Price: value.toString()
	// 	}]
	// };

	// return entity;

	return null;

}

const ToRevaluation = (result: MaterialRevaluation, journal: Document): HarvestReportData => {

	// const entity: HarvestReportData = {
	// 	MaterialRevaluationCode: result.DocEntry,
	// 	journalEntryCode: journal.Number
	// };

	// return entity;

	return null;

}

const ToLog = (request: any, result: any, key: string, module: number): Log => {

	const entity: Log = {
		LOGTYPECODE: result.error ? 1 : 2,
		MODULE: module,
		MESSAGE: result.error ? JSON.stringify(result.error) : 'Sucesso',
		FULLMESSAGE: result.error ? JSON.stringify(result.error) : 'Incluido com sucesso',
		KEY: key,
		REQUESTOBJECT: JSON.stringify(request),
		RESPONSEOBJECT: JSON.stringify(result.data)
	};

	return entity;

}


export const Mapper = {
	From,
	To,
	FromEntrie,
	ToRevaluation,
	ToLog
}