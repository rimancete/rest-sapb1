import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import * as _ from 'lodash';

@Injectable()
export class HanaInvoiceDownDeleteService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

		const query = `
						SELECT 
							 oi."BPLId"             AS "empresa"
							,oi."U_ChaveAcesso"		AS "nfChave"
							,0			 			AS "parParcela"
						FROM 
						${this.databaseName}.OINV oi
						INNER JOIN 
						${this.databaseName}.ORCT  ot
						ON 
						oi."DocEntry"  = ot."DocEntry" 
						WHERE
						oi."U_ALFA_Integration"  = 'N'
						AND
						ot."Canceled" = 'Y'
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
