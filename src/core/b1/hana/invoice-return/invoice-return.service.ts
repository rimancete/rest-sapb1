import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import * as _ from 'lodash';

@Injectable()
export class HanaInvoiceReturnService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

		const query = `
    SELECT 
            o."Serial"   			 AS "nFNumero"
            ,o."BPLId"    			 AS "Empresa"
            ,o."TaxDate"  			 AS "nfData"
            ,o."DocTotal"      		 AS "nfValor"
            ,o."U_ALFA_RequestNumber"  AS "idPedido"
            ,(SELECT  "CFOPCode" FROM ${this.databaseName}.INV1 i WHERE i."DocEntry" = o."DocEntry") AS "transacao"
            ,o."Weight" 			 AS "nfPeso"
            ,o."U_ChaveAcesso"		 AS "nfChave"
            ,0						 AS "nfTipo"
            ,null 					 AS "especDocto"
            ,o."SeriesStr" 			 AS "serie"
            ,null						 AS "emitente"
            ,0						 AS "nfRomaneio"
            ,0						 AS "vlImpostoPerc"	
            ,0                     AS "vlImpostoPeso"
            ,0						 AS "dscImposto"
            ,0 					 AS "nfPesoBruto"
            ,o."CheckDigit" 		 AS "nfDataDigit"
          FROM  ${this.databaseName}.OINV o
          WHERE o."U_ALFA_Integration"  = 'N'
          AND o."U_ALFA_Retry" < 3			 		                      
		`;
		return await this.execute(query);
	}

	async getParcel(record) : Promise<any> {
		const query = `
						SELECT 
								 inv."InstlmntID"    AS "Parcela"
								,inv."DueDate"		 AS "Vencimento"
								,inv."InsTotal"		 AS "valor"
						FROM ${this.databaseName}.INV6 inv
						WHERE inv."DocEntry" = '${record.DocEntry}'
		`
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
