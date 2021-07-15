import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HanaRequestSituationHistoryService extends DatabaseService<any> {

  getNotIntegrated(): Promise<any[]> {
    /*		return this.execute(` 
    
         SELECT DISTINCT
          T0."DocEntry"				        AS "DocEntry",
          T0."DocNum"					        AS "DocNum",
          T2."Serial"					        AS "Serial",
          T0."U_ALFA_ParadigmaId"	  	AS "U_ALFA_ParadigmaId",
          ''						              AS "InvoiceMessage",
          'COMPRA'                   	AS "Type"
        FROM
          ${this.databaseName}.OPOR T0
          
          INNER JOIN ${this.databaseName}.PCH1 T1 
          ON T1."BaseEntry" = T0."DocEntry" 
          AND T1."BaseType" = '22'
          
          INNER JOIN ${this.databaseName}.OPCH T2 
          ON T2."DocEntry" = T1."DocEntry" 
          
        WHERE 
          T0."U_ALFA_ParadigmaId" IS NOT NULL AND
          IFNULL(T0."U_ALFA_ParadigmaReceived",'N') 		= 'S' AND
          IFNULL(T0."U_ALFA_ParadigmaInvoiceSent",'N') 	= 'N'
        	
        `);*/
    return this.execute(`SELECT  op."U_ALFA_RequestNumber" AS "IdKey"
                                ,op."UpdateDate"  AS "HisDate"
                                ,op."DocStatus" AS "Status"
                                ,op."DocNum" AS "SolReqNum"
                            FROM OPRQ op
                            WHERE op."U_ALFA_Integration" = 'N'
    `)

  }

  setIntegrated(itemCode: string, date: string, warehouse: string): Promise<DatabaseResponse<any>> {

    return this.exec(`
		
		`);

  }

  getIntegrationValues(): Promise<DatabaseResponse<any>> {

    return this.exec(`
	
		  `
    );
  }



}
