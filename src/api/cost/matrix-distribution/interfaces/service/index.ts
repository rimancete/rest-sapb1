import { MatrixDistribuitionRequest, MatrixDistribuitionData } from "../controller";
import { JournalEntryDocument } from "../../../../../core/b1/service-layer/journal-entries/interfaces";
import { Log } from '../../../../../core/b1/hana/log/intefaces'
const To = (result: JournalEntryDocument): MatrixDistribuitionData => {

	const entity: MatrixDistribuitionData = {
		journalEntryCode: result.Number
	};

	return entity;

}

export const Mapper = {
	To
}