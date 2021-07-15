import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../../core/logs/interface';


@Injectable()
export class HanaBatchService extends DatabaseService<any> {

	async getNotIntegrated(): Promise<any> {

    const query = `
    
    SELECT   OBT."DistNumber" AS "batchCode" -- Codigo do Lote
            ,OBT."ItemCode" AS "itemCode" -- Codigo do item
            ,'true' AS "isItemDefault"
            ,IT."U_ALFA_Operation" AS "producingUnitCode" -- codigo da unidade produtora
            ,'' AS "projectCode" 
            ,'' AS "periodCode"
            ,'' AS "supplierBatchCode"
            ,OBT."MnfDate" AS "productionDate"
            ,OBT."ExpDate" AS "expirationDate"
            ,'true' AS "active"   	
        FROM ${this.databaseName}.OBTN OBT
        INNER JOIN ${this.databaseName}.OITM IT
        ON OBT."ItemCode"  = IT."ItemCode" 
        WHERE OBT."U_ALFA_Integrated" = 'N'
		`;

		return await this.execute(query);
	}

	async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
		const query = `UPDATE ${this.databaseName}.OBTN SET "U_ALFA_Integrated" = 'Y' WHERE "LotNumber" = '${record.LotNumber}'`;
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
      
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OBTN) INTO TOTAL FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OBTN WHERE "U_ALFA_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OBTN WHERE "U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
			
			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.BATCH} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
    
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
