import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { ItemInventory } from './interfaces';

@Injectable()
export class HanaItemInventoryService extends DatabaseService<any> {

	getNotIntegrated(): Promise<ItemInventory[]> {

		return this.execute(`  
    SELECT
			Company."BPLId"									AS 	"CompanyCode",
			Branch."BPLId" 									AS	"SubsidiaryCode",
			Journal."ItemCode"							AS	"ItemCode",		  
			SUM(Journal."InQty") - SUM(Journal."OutQty")	AS 	"Quantity",
			Warehouse."WhsCode"							AS	"InventoryLocationCode",
			0																AS	"ReservedQuantity",
			null														AS	"Location",
			null														AS	"ItemDerivationCode",
			null														AS	"ItemBatchCode"
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

			INNER JOIN 
				(
					SELECT DISTINCT
						"ItemCode", 
						"LocCode"
					FROM
						${this.databaseName}."OIVL"
					WHERE
						"U_ALFA_Integrated" = 'N' ) JournalPending
			ON JournalPending."ItemCode" = Journal."ItemCode"
			AND JournalPending."LocCode" = Journal."LocCode"										

		WHERE
				Journal."LocType" = 64
		AND Item."ManBtchNum" = 'N'

		GROUP BY
			Company."BPLId",
			Branch."BPLId",
			Journal."ItemCode",
			Warehouse."WhsCode"
			
		UNION ALL

		SELECT
			Company."BPLId"										AS 	"CompanyCode",
			Branch."BPLId" 										AS	"SubsidiaryCode",
			Journal."ItemCode"								AS	"ItemCode",		  
			SUM(JournalItem."Quantity")				AS 	"Quantity",
			Warehouse."WhsCode"								AS	"InventoryLocationCode",
			0																	AS	"ReservedQuantity",
			null															AS	"Location",
			null															AS	"ItemDerivationCode",
			BatchNumber."DistNumber"					AS	"ItemBatchCode"
		FROM
			${this.databaseName}."OITL" Journal
								
			LEFT JOIN ${this.databaseName}."ITL1" JournalItem
			ON JournalItem."LogEntry" = Journal."LogEntry"
			
			LEFT JOIN ${this.databaseName}."OBTN" BatchNumber
			ON BatchNumber."SysNumber" = JournalItem."SysNumber"			
			
			INNER JOIN 
				(
					SELECT DISTINCT
						J."ItemCode", 
						J."LocCode",
						I."SysNumber"
					FROM
						${this.databaseName}."OITL" J
						
						INNER JOIN ${this.databaseName}."ITL1" I
						ON I."LogEntry" = J."LogEntry"
					WHERE
						I."U_ALFA_Integrated" = 'N' ) JournalPending
			ON JournalPending."ItemCode" = Journal."ItemCode"
			AND JournalPending."LocCode" = Journal."LocCode"	
			AND JournalPending."SysNumber" = JournalItem."SysNumber"	
				
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
			
		WHERE
				Journal."LocType" = 64
		AND Item."ManBtchNum" = 'Y'

		GROUP BY
			Company."BPLId",
			Branch."BPLId",
			Journal."ItemCode",
			Warehouse."WhsCode",
			BatchNumber."DistNumber"						
    `);

	}

	setIntegrated(record: ItemInventory): Promise<void> {

		if (record.ItemBatchCode) {

			return this.execute(`
				UPDATE 
					${this.databaseName}.ITL1 JournalItem
				SET
					"U_ALFA_Integrated" = 'Y'
				FROM
					${this.databaseName}."OITL" Journal
								
					LEFT JOIN ${this.databaseName}."ITL1" JournalItem
					ON JournalItem."LogEntry" = Journal."LogEntry"
					
					LEFT JOIN ${this.databaseName}."OBTN" BatchNumber
					ON BatchNumber."SysNumber" = JournalItem."SysNumber"	

				WHERE 
						JournalItem."U_ALFA_Integrated" = 'N'
				AND Journal."ItemCode" = '${record.ItemCode}'
				AND Journal."LocCode" = '${record.InventoryLocationCode}'
				AND BatchNumber."DistNumber" = '${record.ItemBatchCode}'
			`);

		} else {

			return this.execute(`
				UPDATE 
					${this.databaseName}.OIVL Journal
				SET
					"U_ALFA_Integrated" = 'Y'
				WHERE 
						Journal."U_ALFA_Integrated" = 'N'
				AND Journal."ItemCode" = '${record.ItemCode}'
				AND Journal."LocCode" = '${record.InventoryLocationCode}'
			`);

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
