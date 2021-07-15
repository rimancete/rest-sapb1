import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { State } from '../../../../core/simple-farm/state/interfaces';
import { LogModule, LogType } from '../../../../core/logs/interface';

@Injectable()
export class HanaStateService extends DatabaseService<any> {

	getNotIntegrated(): Promise<State[]> {

		return this.execute(`
    SELECT
      UF."Code"
    , UF."Name" 
    , UF."Country"  AS "CountryCode"

    FROM ${this.databaseName}.OCST UF

    INNER JOIN ${this.databaseName}.OCRY Country
    ON Country."Code" = UF."Country"
    AND Country."U_ALFA_Integrated" = 'Y'

    WHERE
      UF."U_ALFA_Integrated" = 'N'`);
	}


	setIntegrated(record: State): Promise<DatabaseResponse<any>> {
		return this.exec(`UPDATE ${this.databaseName}.OCST SET "U_ALFA_Integrated" = 'Y' WHERE "Code" = '${record.Code}'`);
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
			
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCST) INTO TOTAL FROM DUMMY;
		
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCST WHERE "U_ALFA_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
		
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCST WHERE "U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
		
		SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.STATE} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
      
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

}
