import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../logs/interface';
import { Contract } from 'src/core/simple-farm/contract/interfaces';
import * as _ from 'lodash';

@Injectable()
export class HanaPaymentConditionService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

		const query = `
		
						SELECT 
							PAYMENT."GroupNum",
							PAYMENT."PymntGroup",
							PAYMENT."PymntGroup",
							false AS "FixedDay",
							false AS "Anticipated",
							3 AS "Type",
							true AS "Active" 
						FROM 
							${this.databaseName}.OCTG PAYMENT
						WHERE
							"U_ALFA_Integrated" = 'N' 
		                      
		`;
		return await this.execute(query);
	}

	async getNotIntegratedInstallments(GroupNum): Promise<any> {

		const query = `
						SELECT
							INSTALLMENTS."CTGCode",
							INSTALLMENTS."IntsNo",
							INSTALLMENTS."InstPrcnt",
							INSTALLMENTS."InstDays"
						FROM ${this.databaseName}.CTG1 INSTALLMENTS
						WHERE 
							INSTALLMENTS."CTGCode" = '${GroupNum}'
		`;
		return await this.execute(query);
	}



	async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OCTG SET "U_ALFA_Integrated" = 'Y' WHERE "GroupNum" = '${record.GroupNum}'`;
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
      
      TOTAL := 0;
      IMPORTED := 0;
      PERCENTUAL := 0;
      
			SELECT (
        SELECT 
        count(*)
      FROM 
        ${this.databaseName}.OCTG PAYMENT

      ) INTO TOTAL FROM DUMMY;
			
			SELECT (
        SELECT 
            COUNT(*)
      FROM 
        ${this.databaseName}.OCTG PAYMENT
      WHERE
        "U_ALFA_Integrated" = 'Y' 
                    


      ) INTO IMPORTED FROM DUMMY;
			
			SELECT (
        SELECT 
             COUNT(*)
      FROM 
        ${this.databaseName}.OCTG PAYMENT
      WHERE
        "U_ALFA_Integrated" = 'N' 
                    

        ) INTO NOTIMPORTED FROM DUMMY;
			
			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.PAYMENT_CONDITION} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
    
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
