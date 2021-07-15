import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { ItemGroup } from '../../../../core/simple-farm/item-group/interfaces';
import { LogModule, LogType } from '../../../../core/logs/interface';

@Injectable()
export class HanaItemGroupService extends DatabaseService<any> {

	getNotIntegrated(): Promise<ItemGroup[]> {
		return this.execute(`  
    SELECT
      ItemGroup."ItmsGrpCod"           AS "Code",
      ItemGroup."ItmsGrpNam"           AS "Description"        
    FROM 
      ${this.databaseName}.OITB ItemGroup
    WHERE
			ItemGroup."U_ALFA_Integrated" = 'N'
		`);
	}

	setIntegrated(record: ItemGroup) {
		return this.exec(`UPDATE ${this.databaseName}.OITB SET "U_ALFA_Integrated" = 'Y' WHERE "ItmsGrpCod" = ${record.Code}`);
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
		  
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OITB) INTO TOTAL FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OITB WHERE "U_ALFA_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
		
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OITB WHERE "U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;

			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.ITEM_GROUP} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
			
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
