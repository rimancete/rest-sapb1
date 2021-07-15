import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../../core/logs/interface';
import { Contract } from 'src/core/simple-farm/contract/interfaces';
import * as _ from 'lodash';

@Injectable()
export class HanaContractService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

		const query = `
		SELECT 	
			 OA."AbsID" 		-- contrato
			,Company."BPLId"    -- Companycode 
			,OA."StartDate"		-- startdate
			,OA."EndDate"       -- enddate
			,OA."Status"		-- status
			,OA."BpCode"		-- ProviderCode
			,OA."Remarks"		-- Observações	
			,OA."U_ALFA_Conctract_Type" AS "Type"
		FROM ${this.databaseName}.OOAT OA 
		LEFT JOIN ${this.databaseName}.OBPL Company ON "MainBPL" = 'Y'
		WHERE OA."U_ALFA_IntegrateF1" = 'Y' 
		AND OA."U_ALFA_Integrated" = 'N' 
		AND OA."Status" = 'A'
		
		 		                      
		`;
		return await this.execute(query);
	}

	async getNotIntegratedItems(contractId): Promise<any> {

      const itens = `
          SELECT     T0."AbsID"
                    ,T0."BpName"
                    ,T1."ItemCode" 
                    ,T1."UnitPrice"
                    ,T0."SignDate"
                    ,T2."U_ALFA_Operation"
                    ,T2."U_ALFA_FlowRate"
                    ,T1."PlanQty"
              FROM ${this.databaseName}.OOAT T0 
              inner join ${this.databaseName}.OAT1  T1
              ON T0."AbsID" = T1."AgrNo"
              inner join ${this.databaseName}.OITM T2
              ON T1."ItemCode" = T2."ItemCode"
              WHERE T1."AgrNo" = ${contractId}
		`;
		return await this.execute(itens);
	}



	async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OOAT SET "U_ALFA_Integrated" = 'Y' WHERE "AbsID" = '${record.AbsID}'`;
		return await this.execute(query);
  }
  
  async getWareHouse(record: any): Promise<DatabaseResponse<any>> {
    const query = `SELECT 
                          pqt."WhsCode"
                      FROM ${this.databaseName}.OOAT OA
                      INNER JOIN ${this.databaseName}.PQT1 pqt ON pqt."AgrNo" = OA."AbsID"
                      INNER JOIN ${this.databaseName}.OPQT opq ON opq."DocEntry" = pqt."DocEntry"
                      WHERE OA."U_ALFA_IntegrateF1" = 'Y' 
                      AND OA."U_ALFA_Integrated" = 'Y' 
                      AND OA."AbsID" = ${record.contractCode}
                      AND opq."BPLId" = ${record.businessPlaceCode}`

                const query_fix = `SELECT 
                      TOP 1  pqt."WhsCode"
                    FROM ${this.databaseName}.OOAT OA
                    INNER JOIN ${this.databaseName}.PQT1 pqt ON pqt."AgrNo" = OA."AbsID"
                    INNER JOIN ${this.databaseName}.OPQT opq ON opq."DocEntry" = pqt."DocEntry"
                    WHERE OA."U_ALFA_IntegrateF1" = 'Y' 
                    AND OA."U_ALFA_Integrated" = 'Y' 
                    AND OA."AbsID" = ${record.contractCode}`;
    return await this.execute(query_fix);
  }

	getIntegrationValues(): Promise<DatabaseResponse<any>> {

		return this.exec(`
    DO
    BEGIN
    
      DECLARE TOTAL			INTEGER;
      DECLARE IMPORTED		INTEGER;
      DECLARE NOTIMPORTED	INTEGER;
      DECLARE PERCENTUAL	DECIMAL(18,2);
	  DECLARE LAST_UPDATE	SECONDDATE;
      
      TOTAL := 0;
      IMPORTED := 0;
      PERCENTUAL := 0;
      
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OOAT WHERE "U_ALFA_IntegrateF1" = 'Y') INTO TOTAL FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OOAT WHERE "U_ALFA_Integrated" = 'Y' AND "U_ALFA_IntegrateF1" = 'Y') INTO IMPORTED FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OOAT WHERE "U_ALFA_Integrated" = 'N' AND "U_ALFA_IntegrateF1" = 'Y') INTO NOTIMPORTED FROM DUMMY;
			
			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.CONTRACT} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
    
			PERCENTUAL := (IMPORTED / TOTAL) * 100;
			
			SELECT 
				:TOTAL AS "Total", 
				:IMPORTED AS "Importadas",
				:NOTIMPORTED AS "NaoImportadas", 
				:PERCENTUAL AS "Percentual",
				:LAST_UPDATE AS "UltimaIntegracao"
			FROM DUMMY;
			
		END;
		`
		);
	}


	async getContract(code: string): Promise<DatabaseResponse<Contract[]>> {

		const query =`
		SELECT 
			  "AbsID" 
		FROM ${this.databaseName}.OOAT 
		
		WHERE "AbsID" = '${code}' 
		`
		try {
		  const result = await this.exec(query);
		  return _.first(result.data);
		} catch (exception) {
		  return null;
		}
	  }
	

}
