import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../../core/logs/interface';

@Injectable()
export class HanaCurrencyCategoryService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any[]> {

		const query = `
		SELECT 
			Currencies."DocCurrCod"	AS "Symbol"
		FROM 
			${this.databaseName}.OCRN Currencies
		WHERE 
				(SELECT COUNT(*) FROM ${this.databaseName}.OCRN WHERE "U_ALFA_Integrated_Catgry" = 'N') > 0
		AND (SELECT COUNT(*) FROM ${this.databaseName}.OCRN WHERE "U_ALFA_Integrated" = 'N') = 0
		`;
		return await this.execute(query);

	}

	async setIntegrated(): Promise<DatabaseResponse<any>> {

		const query = `
		UPDATE 
			${this.databaseName}.OCRN Currencies
		SET
			"U_ALFA_Integrated_Catgry" = 'Y'
		WHERE 
			Currencies."U_ALFA_Integrated" = 'Y'
		`;

		return await this.execute(query);

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
		  
		  TOTAL := 1;
		  IMPORTED := 0;
		  PERCENTUAL := 0;
		  			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCRN WHERE "U_ALFA_Integrated_Catgry" = 'Y') INTO IMPORTED FROM DUMMY;
		
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCRN WHERE "U_ALFA_Integrated_Catgry" = 'N') INTO NOTIMPORTED FROM DUMMY;
				
			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.CURRENCY_CATEGORY} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
		
			PERCENTUAL := (IMPORTED / TOTAL) * 100;
			
			SELECT 
				:TOTAL AS "Total", 
				CASE WHEN :NOTIMPORTED > 0 THEN 0 ELSE 1 END AS "Importadas",
				CASE WHEN :NOTIMPORTED > 0 THEN 1 ELSE 0 END AS "NaoImportadas", 
				CASE WHEN :NOTIMPORTED > 0 THEN 0 ELSE 100 END AS "Percentual",
				:LAST_UPDATE AS "UltimaIntegracao"
			FROM DUMMY;
			
		END;
		  `
		);
	}


}