import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../../core/logs/interface';
import * as _ from 'lodash';

@Injectable()
export class HanaInventoryLocationService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any[]> {

		const query = `
		SELECT 
		  Company."BPLId"																												AS "CompanyCode"
		, '[' || 
			IFNULL('{"CompanySubsidiaryCode": "' || CAST(NULLIF(NULLIF(Warehouse."BPLid",Company."BPLId"),0) AS VARCHAR) || '"}', 
			(SELECT STRING_AGG('{"CompanySubsidiaryCode": "' || CAST("BPLId" AS VARCHAR) || '"}',',') FROM ${this.databaseName}.OBPL WHERE "U_ALFA_Integrated" = 'Y' AND "MainBPL" = 'N'))
			 || ']'																																AS "CompanySubsidiaries"
		, Warehouse."WhsCode"     																							AS "Code"
		, CONCAT(CONCAT(Warehouse."WhsCode",' - '),Warehouse."WhsName") 				AS "ShortName"
		, Warehouse."WhsName"					AS "Description"
		, Warehouse."OwnerCode"   																							AS "Ownership"
		, (CASE WHEN Warehouse."Inactive" = 'Y' THEN 'false' ELSE 'true' END) 	AS "Active"

		FROM ${this.databaseName}.OWHS Warehouse
				
		INNER JOIN ${this.databaseName}.OBPL Company
		ON Company."U_ALFA_Integrated" = 'Y'
		AND Company."MainBPL" = 'Y'

		LEFT JOIN ${this.databaseName}.OBPL Branch
		ON Warehouse."BPLid" = Branch."BPLId"
    AND Branch."U_ALFA_Integrated" = 'Y'
    
    LEFT JOIN ${this.databaseName}.OWHS ReserveWhs
		ON Warehouse."WhsCode" = ReserveWhs."U_ALFA_ReserveWhs"		

		WHERE
      ReserveWhs."WhsCode" IS NULL 
    AND 	
      Warehouse."U_ALFA_Integrated" = 'N' 
    AND 
      Warehouse."WhsName" IS NOT NULL 
    AND 
      Warehouse."U_ALFA_Retry"  < 3
		`;

		return await this.execute(query);

	}

	async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OWHS SET "U_ALFA_Integrated" = 'Y' WHERE "WhsCode" = '${record.Code}'`;
		return await this.execute(query);
	}

	async updateRetry(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OWHS SET "U_ALFA_Retry" = "U_ALFA_Retry" + 1 WHERE "WhsCode" = '${record.Code}'`;
		return await this.execute(query);
	}

	async getWarehouse(branch: number, warehouse: string): Promise<any> {

		const query = `
		SELECT 
			Warehouse."WhsCode",			
			Warehouse."U_ALFA_ReserveWhs" 
		FROM 
			${this.databaseName}.OWHS Warehouse  

		INNER JOIN ${this.databaseName}.OBPL Branch 
		ON Warehouse."BPLid" = Branch."BPLId" 

		WHERE 
				Branch."BPLId" = ${branch} 
		AND Warehouse."WhsCode" = ${warehouse}
		`;

		try {
			const result = await this.exec(query);
			return _.first(result.data);
		} catch (exception) {
			return null;
		}
	}

	getIntegrationValues(): Promise<DatabaseResponse<any>> {

		return this.exec(`
		DO
		BEGIN
		
			DECLARE TOTAL			INTEGER;
			DECLARE IMPORTED		INTEGER;
			DECLARE NOTIMPORTED		INTEGER;
			DECLARE PERCENTUAL		DECIMAL(18,2);
			DECLARE LAST_UPDATE		SECONDDATE;
			
			TOTAL := 0;
			IMPORTED := 0;
			PERCENTUAL := 0;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OWHS) INTO TOTAL FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OWHS WHERE "U_ALFA_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OWHS WHERE "U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
			
			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.INVENTORY_LOCATION} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
				
			PERCENTUAL := (IMPORTED / TOTAL) * 100;
			
			SELECT 
				:TOTAL AS "Total", 
				:IMPORTED AS "Importadas",
				:NOTIMPORTED AS "NaoImportadas", 
				:PERCENTUAL AS "Percentual",
					:LAST_UPDATE 		AS "UltimaIntegracao" 
			FROM DUMMY;
			
		END;
		  `
		);
	}

}

