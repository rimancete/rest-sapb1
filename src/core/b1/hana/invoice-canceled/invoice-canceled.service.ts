import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import * as _ from 'lodash';

@Injectable()
export class HanaInvoiceCanceledService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

		const query = `
						SELECT
								"U_ChaveAcesso" as "nfChave",
								1 as "nfCancelada",
								"DocNum"
						FROM ${this.databaseName}.OINV
						WHERE "CANCELED" = 'Y'
						AND "U_ChaveAcesso" IS NOT NULL
						AND "U_ALFA_Integration" = 'N'
						AND "U_ALFA_Retry" < 3			 		                      
		`;
		return await this.execute(query);
	}

	async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OINV SET "U_ALFA_Integrated" = 'Y' WHERE "DocNum" = '${record.DocNum}' AND "U_ChaveAcesso" = '${record.nfChave}' `;
		return await this.execute(query);
	}

	async updateRetry(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OINV SET "U_ALFA_Retry" = "U_ALFA_Retry" + 1WHERE "DocNum" = '${record.DocNum}' AND "U_ChaveAcesso" = '${record.nfChave}'`;
		return await this.execute(query);
	}
	
}
