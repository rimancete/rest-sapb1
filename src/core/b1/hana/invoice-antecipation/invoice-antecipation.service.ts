import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import * as _ from 'lodash';

@Injectable()
export class HanaInvoiceAntecipationService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

		const query = `
						SELECT 
								op."BPLId"  AS "empresa"
								,op."U_ALFA_RequestNumber"  AS "idPedido"
								,op."DocNum" AS "numTitulo"
								,ot."TaxDate" AS "dataPagto"
								,ot."DocTotal" AS "valorPagto"
								,0 AS "ptaxPagto"
								,0 AS "seqFctoFinanERP"
							FROM 
							${this.databaseName}.ODPI op
							INNER JOIN 
							${this.databaseName}.ORCT ot
							ON 
							op."DocEntry"  = ot."DocEntry" 
							WHERE
							op."U_ALFA_Integration" = 'N'
							AND
							op."U_ALFA_Retry"  < 3
							AND 
							ot."Canceled" = 'N'			 		                      
		`;
		return await this.execute(query);
	}

	async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.ODPI SET "U_ALFA_Integration" = 'Y' WHERE "DocNum" = '${record.DocNum}'`;
		return await this.execute(query);
	}

	async updateRetry(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.ODPI SET "U_ALFA_Retry" = "U_ALFA_Retry" + 1 WHERE "DocNum" = '${record.DocNum}'`;
		return await this.execute(query);
	}
	
}
