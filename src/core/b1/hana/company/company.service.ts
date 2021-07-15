import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { CompanyResult } from './interfaces';
import { LogModule, LogType } from '../../../../core/logs/interface';

@Injectable()
export class HanaCompanyService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<CompanyResult[]> {

		const query = `
    SELECT
      Branch."BPLId"                                AS "Code"
    , Branch."BPLName"                              AS "Name"
    , ''                                            AS "Email"
    , '' 													                  AS "Phone"
    , IFNULL(Branch."AliasName",Branch."BPLName")   AS "TradeName"  
    FROM 
      ${this.databaseName}.OBPL Branch
    
    WHERE 
      Branch."MainBPL" = 'Y' AND
      Branch."U_ALFA_Integrated" = 'N'
		`;

		return await this.execute(query);

	}

	async setIntegrated(record: CompanyResult): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OBPL SET "U_ALFA_Integrated" = 'Y' WHERE "BPLId" = '${record.Code}'`;
		return await this.execute(query);
	}

	getIntegrationValues(): Promise<DatabaseResponse<any>> {

		return this.exec(`
        DO
        BEGIN
        
          DECLARE TOTAL_BRANCH	INTEGER;
          DECLARE IMPORTED			INTEGER;
          DECLARE NOTIMPORTED		INTEGER;
          DECLARE PERCENTUAL		DECIMAL(18,2);
          DECLARE LAST_UPDATE		SECONDDATE;
          
          TOTAL_BRANCH := 0;
          IMPORTED := 0;
          PERCENTUAL := 0;
          
        SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OBPL WHERE "MainBPL" = 'Y') INTO TOTAL_BRANCH FROM DUMMY;
        
        SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OBPL WHERE "U_ALFA_Integrated" = 'Y' AND "MainBPL" = 'Y') INTO IMPORTED FROM DUMMY;
        
        SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OBPL WHERE "U_ALFA_Integrated" = 'N' AND "MainBPL" = 'Y') INTO NOTIMPORTED FROM DUMMY;
        
				SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.COMPANY} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
        
        PERCENTUAL := (IMPORTED / TOTAL_BRANCH) * 100;
        
        SELECT 
          :TOTAL_BRANCH AS "Total", 
          :IMPORTED AS "Importadas",
          :NOTIMPORTED AS "NaoImportadas", 
          :PERCENTUAL AS "Percentual",
          :LAST_UPDATE AS "UltimaIntegracao"
        FROM DUMMY;
        
        END;
      `
		);
	}

}
