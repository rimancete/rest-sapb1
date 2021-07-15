import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HanaCurrencyQuoteService extends DatabaseService<any> {

	getNotIntegrated(): Promise<any[]> {
		return this.execute(`
      SELECT 
				CurrencyFrom."ISOCurrCod"											AS 	"CurrencyIsoFrom"
      , CurrencyTo."ISOCurrCod"                       AS 	"CurrencyIsoTo"
      , 'GER'                                         AS 	"CurrencyCategoryCode"
      , CAST(CurrencyQuote."RateDate" AS DATE)        AS 	"QuoteDate"
			, CAST(CurrencyQuote."Rate" AS DECIMAL)         AS 	"Quote"
      FROM 
        ${this.databaseName}.ORTT CurrencyQuote
			
				INNER JOIN ${this.databaseName}.OCRN CurrencyFrom 
				ON CurrencyQuote."Currency" = CurrencyFrom."CurrCode"	
				AND CurrencyFrom."U_ALFA_Integrated" = 'Y'			

				INNER JOIN ${this.databaseName}.OADM Company
				ON 1=1
			
				INNER JOIN ${this.databaseName}.OCRN CurrencyTo 
				ON Company."MainCurncy" = CurrencyTo."CurrCode"
				AND CurrencyTo."U_ALFA_Integrated" = 'Y'			

      WHERE 
				CurrencyQuote."U_ALFA_Integrated" = 'N' OR 
				CurrencyQuote."RateDate" = ADD_DAYS(CURRENT_DATE, -1)
    `
		);
	}

	setIntegrated(currency: string, date: string): Promise<DatabaseResponse<any[]>> {

		return this.exec(`
      UPDATE 
				CurrencyQuote
			SET
				CurrencyQuote."U_ALFA_Integrated" = 'Y'
      FROM 
        ${this.databaseName}.ORTT CurrencyQuote
			
				INNER JOIN ${this.databaseName}.OCRN CurrencyFrom 
				ON CurrencyQuote."Currency" = CurrencyFrom."CurrCode"	
				AND CurrencyFrom."U_ALFA_Integrated" = 'Y'		

      WHERE 
				CurrencyQuote."U_ALFA_Integrated" = 'N' AND
				CurrencyFrom."ISOCurrCod" = '${currency}' AND
				CAST(CurrencyQuote."RateDate" AS DATE) = '${date}'		
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
			
		SELECT (
          SELECT COUNT(*) FROM ${this.databaseName}.ORTT CurrencyQuote

          INNER JOIN ${this.databaseName}.OCRN CurrencyFrom 
          ON CurrencyQuote."Currency" = CurrencyFrom."CurrCode"	

          INNER JOIN ${this.databaseName}.OADM Company
          ON 1=1
        
          INNER JOIN ${this.databaseName}.OCRN CurrencyTo 
          ON Company."MainCurncy" = CurrencyTo."CurrCode"		
          
          WHERE CurrencyQuote."RateDate" < (SELECT CURRENT_DATE FROM dummy) 			
				
			) INTO TOTAL FROM DUMMY;
		
		SELECT (
      SELECT COUNT(*) FROM ${this.databaseName}.ORTT CurrencyQuote

      INNER JOIN ${this.databaseName}.OCRN CurrencyFrom 
      ON CurrencyQuote."Currency" = CurrencyFrom."CurrCode"	

      INNER JOIN ${this.databaseName}.OADM Company
      ON 1=1
    
      INNER JOIN ${this.databaseName}.OCRN CurrencyTo 
      ON Company."MainCurncy" = CurrencyTo."CurrCode"		
      
      WHERE CurrencyQuote."RateDate" < (SELECT CURRENT_DATE FROM dummy) 
				AND CurrencyQuote."U_ALFA_Integrated" = 'Y'
		) INTO IMPORTED FROM DUMMY;
		
		SELECT (
				
      SELECT COUNT(*) FROM ${this.databaseName}.ORTT CurrencyQuote

      INNER JOIN ${this.databaseName}.OCRN CurrencyFrom 
      ON CurrencyQuote."Currency" = CurrencyFrom."CurrCode"	

      INNER JOIN ${this.databaseName}.OADM Company
      ON 1=1
    
      INNER JOIN ${this.databaseName}.OCRN CurrencyTo 
      ON Company."MainCurncy" = CurrencyTo."CurrCode"		
      
      WHERE CurrencyQuote."RateDate" < (SELECT CURRENT_DATE FROM dummy) 	

		AND CurrencyQuote."U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
		
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