import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HanaItemPriceService extends DatabaseService<any> {

	getNotIntegrated(): Promise<any[]> {
		return this.execute(`  
    SELECT
			Company."BPLId"							AS 	"CompanyCode",
			Branch."BPLId" 							AS	"SubsidiaryCode",
			Journal."ItemCode"					AS	"ItemCode",		  
			AVG(Journal."Price")				AS	"Price",
			Journal."DocDate"						AS	"PriceDate",
			Warehouse."WhsCode"					AS	"InventoryLocationCode"
		FROM
			${this.databaseName}."OIVL" Journal

			INNER JOIN ${this.databaseName}."OITM" Item
			ON Item."ItemCode" = Journal."ItemCode"
			AND Item."U_ALFA_Integrated" = 'Y'

			INNER JOIN ${this.databaseName}."OWHS" Warehouse
			ON Warehouse."WhsCode" = Journal."LocCode"
			AND Warehouse."U_ALFA_Integrated" = 'Y'

			INNER JOIN ${this.databaseName}."OBPL" Branch
			ON Warehouse."BPLid" = Branch."BPLId"
			AND Branch."U_ALFA_Integrated" = 'Y'

			INNER JOIN ${this.databaseName}."OBPL" Company
			ON Company."U_ALFA_Integrated" = 'Y'
			AND Company."MainBPL" = 'Y'

			INNER JOIN ${this.databaseName}."OIVL" JournalPending
			ON JournalPending."U_ALFA_IntegratedPrice" = 'N'
			AND JournalPending."ItemCode" = Journal."ItemCode"
			AND JournalPending."LocCode" = Journal."LocCode"

		WHERE
			Journal."LocType" = 64

		GROUP BY
			Company."BPLId",
			Branch."BPLId",
			Journal."ItemCode",
			Journal."DocDate",
			Warehouse."WhsCode"
    `);

	}

	setIntegrated(itemCode: string, date: string, warehouse: string): Promise<DatabaseResponse<any>> {

		return this.exec(`
		UPDATE 
			${this.databaseName}.OIVL Journal
		SET
			"U_ALFA_IntegratedPrice" = 'Y'
		WHERE 
				Journal."U_ALFA_IntegratedPrice" = 'N'
		AND Journal."ItemCode" = '${itemCode}'
		AND Journal."DocDate" = '${date}'
		AND Journal."LocCode" = '${warehouse}'
		`);

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
			
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OIVL WHERE "LocType" = 64) INTO TOTAL FROM DUMMY;
		
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OIVL WHERE "U_ALFA_Integrated" = 'Y' AND "LocType" = 64) INTO IMPORTED FROM DUMMY;
		
		SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OIVL WHERE "U_ALFA_Integrated" = 'N' AND "LocType" = 64) INTO NOTIMPORTED FROM DUMMY;
		
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
