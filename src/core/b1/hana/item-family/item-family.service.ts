import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { ItemFamily } from '../../../../core/simple-farm/item-family/interfaces';

@Injectable()
export class HanaItemFamilyService extends DatabaseService<any> {

	getNotIntegrated(): Promise<ItemFamily[]> {
		return this.execute(`  
    SELECT 	  
      MaterialType."Code"   AS "Code"
    , MaterialType."Name"   AS "Description"       
    FROM 
      ${this.databaseName}."@ALFA_SUBGROUP" MaterialType
    WHERE
      MaterialType."U_Integrated" = 'N'
    `);

	}

	setIntegrated(record: ItemFamily) {
    return this.exec(`UPDATE ${this.databaseName}."@ALFA_SUBGROUP" SET "U_Integrated" = 'Y' WHERE "Code" = '${record.Code}'`);
	}

	getIntegrationValues(): Promise<DatabaseResponse<any>> {

		return this.exec(`
		DO
		BEGIN
		
		  DECLARE TOTAL			INTEGER;
		  DECLARE IMPORTED		INTEGER;
		  DECLARE NOTIMPORTED		INTEGER;
		  DECLARE PERCENTUAL		DECIMAL(18,2);
		  
		  TOTAL := 0;
		  IMPORTED := 0;
		  PERCENTUAL := 0;
		  
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}."@ALFA_SUBGROUP") INTO TOTAL FROM DUMMY;
		
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}."@ALFA_SUBGROUP" WHERE "U_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
    
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}."@ALFA_SUBGROUP" WHERE "U_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
		
		PERCENTUAL := (IMPORTED / TOTAL) * 100;
		
		SELECT 
		  :TOTAL AS "Total", 
		  :IMPORTED AS "Importadas",
		  :NOTIMPORTED AS "NaoImportadas", 
		  :PERCENTUAL AS "Percentual" 
		FROM DUMMY;
		
		END;
		  `
		);
	}

}
