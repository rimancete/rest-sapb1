import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import * as _ from 'lodash';

@Injectable()
export class HanaInvoiceDownService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

		const query = `
						SELECT 
							oi."BPLId"             AS "empresa"
							,oi."Serial"			AS "nfNumero"
							,oi."U_ChaveAcesso"		AS "nfChave"
							,0			 			AS "parParcela"
							,ot."SeqCode" 			AS "seqPagamento"
							,ot."TaxDate" 			AS "dataPagto"
							,ot."DocTotal" 			AS "valorPagto"
							,'1.0'					AS "ptaxPagto"
							,0						AS "seqFctoFinanErp"
						FROM 
						${this.databaseName}.OINV oi
						INNER JOIN 
						${this.databaseName}.ORCT  ot
						ON 
						oi."DocEntry"  = ot."DocEntry" 
						WHERE
						oi."U_ALFA_Integration"  = 'N'
						AND
						ot."Canceled" = 'N'
						AND
						oi."U_ALFA_Retry" < 3			 		                      
		`;
		return await this.execute(query);
	}

	async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OINV SET "U_ALFA_Integrated" = 'Y' WHERE "DocNum" = '${record.DocNum}' AND "U_ChaveAcesso" = '${record.nfChave}' `;
		return await this.execute(query);
	}

	async updateRetry(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OINV SET "U_ALFA_Retry" = "U_ALFA_Retry" + 1 WHERE "DocNum" = '${record.DocNum}' AND "U_ChaveAcesso" = '${record.nfChave}'`;
		return await this.execute(query);
	}
	
}
