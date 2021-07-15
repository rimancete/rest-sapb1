import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { UnitMeasurement } from '../../../../core/simple-farm/unit-measurement/interfaces';
import { LogModule, LogType } from '../../../../core/logs/interface';
import * as _ from 'lodash';

@Injectable()
export class HanaUnitMeasurementService extends DatabaseService<any> {

	getNotIntegrated(): Promise<UnitMeasurement[]> {

		return this.execute(`
			SELECT 
				UnitMeasurement."UomCode"  		AS "Code"
			,	UnitMeasurement."UomName"  		AS "Description"                        
			FROM 
				${this.databaseName}.OUOM UnitMeasurement                        
			WHERE 
				UnitMeasurement."U_ALFA_Integrated" = 'N'
		`);

	}

	async setIntegrated(record: UnitMeasurement): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OUOM SET "U_ALFA_Integrated" = 'Y' WHERE "UomCode" = '${record.Code}'`;
		return await this.execute(query);
  }
  
  async getUOMEntry(measureUnit: string): Promise<string> {
    const query = `		
      SELECT 
        "UomEntry"
      FROM 
        ${this.databaseName}.OUOM
      WHERE 
        "UomCode" = '${measureUnit}'
    `;

    try {
      const result = await this.execute(query);
      return _.get(_.first(result),'UomEntry');
    } catch (exception) {
      return null;
    }

	}




	getIntegrationValues(): Promise<DatabaseResponse<any>> {

		return this.exec(`
		DO
		BEGIN
		
			DECLARE TOTAL					INTEGER;
			DECLARE IMPORTED			INTEGER;
			DECLARE NOTIMPORTED		INTEGER;
			DECLARE PERCENTUAL		DECIMAL(18,2);
			DECLARE LAST_UPDATE		SECONDDATE;
			
			TOTAL := 0;
			IMPORTED := 0;
			PERCENTUAL := 0;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OUOM) INTO TOTAL FROM DUMMY;
		
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OUOM WHERE "U_ALFA_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
		
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OUOM WHERE "U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
		
			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.UNIT_MEASUREMENT} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
			
			PERCENTUAL := (IMPORTED / TOTAL) * 100;
		
			SELECT 
				:TOTAL 					AS "Total", 
				:IMPORTED 			AS "Importadas",
				:NOTIMPORTED 		AS "NaoImportadas", 
				:PERCENTUAL 		AS "Percentual",
				:LAST_UPDATE 		AS "UltimaIntegracao"
			FROM 
				DUMMY;
		
		END;
		`
		);
	}
}

