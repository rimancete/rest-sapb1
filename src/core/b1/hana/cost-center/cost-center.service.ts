import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { CostCenter } from '../../../simple-farm/cost-center/interfaces'
import { LogModule, LogType } from '../../../../core/logs/interface';
import * as _ from 'lodash';
import { CostCenterSummary, ProductionSummary } from './interfaces';

@Injectable()
export class HanaCostCenterService extends DatabaseService<any> {

  async getNotIntegrated(): Promise<CostCenter[]> {

    const query = `  
    SELECT 
      CostCenter."PrcCode"                                                AS "Code"
    , CostCenter."PrcName"                                                AS "Description"
    , CostCenter."PrcName"                                                AS "ShortDescription"
    , (CASE WHEN CostCenter."Active" = 'Y' THEN 'true' ELSE 'false' END)  AS "Active"
    , null                                                                AS "ParentCode"
    , CostCenter."PrcCode"                                                AS "LevelCode"
    , 'true'                                                             	AS "AcceptsEntry"
    , CostCenter."PrcCode"                                                AS "ShortCode"       
    FROM 
      ${this.databaseName}.OPRC CostCenter    
    WHERE 
      CostCenter."U_ALFA_Integrated" = 'N'
    `;
    return await this.execute(query);
  }

  async setIntegrated(record: CostCenter): Promise<DatabaseResponse<any>> {
    const query = `UPDATE ${this.databaseName}.OPRC SET "U_ALFA_Integrated" = 'Y' WHERE "PrcCode" = '${record.Code}'`;
    return await this.execute(query);
  }

  async getCostCenter(code: string): Promise<any> {
    const query = `SELECT 
                      "PrcCode" 
										, "U_Tipo" 
                    FROM 
                      ${this.databaseName}.OPRC 

                    WHERE 
                      "PrcCode" = '${code}'`;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }


  async getInvestmentAccount(accountCode: string): Promise<string> {

    const query = `
			SELECT "U_ALFA_InvAct" FROM ${this.databaseName}.OACT WHERE "AcctCode" = '${accountCode}';
		`;

    try {
      const result = await this.exec(query);
      return _.get(_.first(result.data), 'U_ALFA_InvAct', null);
    } catch (exception) {
      return null;
    }

  }


  async getCostSummary(costCenter: string, project: string, businessPlaceCode: number, startDate: string, endDate: string): Promise<CostCenterSummary[]> {

    const query = `
    SELECT
      SUM("Balance") AS "Balance",
      "ProfitCode",
      "Account",
      "CostAccount",
      "InvAccount"
    FROM (
        SELECT 
            SUM(JOURNAL."Debit") - SUM(JOURNAL."Credit")		AS "Balance",
            JOURNAL."ProfitCode"          					      	AS "ProfitCode",
            ACCOUNT."AcctCode"									            AS "Account", 
            ACCOUNT."U_ALFA_TransAct"							          AS "CostAccount", 
            ACCOUNT."U_ALFA_InvAct"								          AS "InvAccount"
        FROM
            ${this.databaseName}.JDT1 JOURNAL

            INNER JOIN ${this.databaseName}.OACT ACCOUNT
            ON ACCOUNT."AcctCode" = (LEFT(JOURNAL."Account",8) || '99.99')

        WHERE
            JOURNAL."ProfitCode" = '${costCenter}'
        AND JOURNAL."BPLId" = ${businessPlaceCode}
        AND (JOURNAL."RefDate" BETWEEN '${startDate}' AND '${endDate}') 
        AND (LEFT(JOURNAL."Account",4) = '5.01' AND RIGHT(JOURNAL."Account",2) <> '99')    
        ${project ? ` AND JOURNAL."Project" = '${project}' ` : ' '}

        GROUP BY
            ACCOUNT."AcctCode"
        ,   JOURNAL."ProfitCode"
        ,   ACCOUNT."U_ALFA_TransAct" 
        ,   ACCOUNT."U_ALFA_InvAct"    
        
        UNION ALL

        SELECT 
          SUM(JOURNAL."Debit") - SUM(JOURNAL."Credit")	                      AS "Balance",
          JOURNAL."ProfitCode"          						                          AS "ProfitCode",
          (LEFT(JOURNAL."Account",8) || '11.99')                           		AS "Account", 
          '1.01.02.02.' || RIGHT(JOURNAL."Account",2)                         AS "CostAccount", 
          '1.02.05.01.' || RIGHT(JOURNAL."Account",2)                         AS "InvAccount"
        FROM
          ${this.databaseName}.JDT1 JOURNAL

            INNER JOIN  ${this.databaseName}.OACT ACCOUNT
            ON ACCOUNT."AcctCode" = (LEFT(JOURNAL."Account",8) || '11.99')

        WHERE
            JOURNAL."ProfitCode" = '${costCenter}'
        AND JOURNAL."BPLId" = ${businessPlaceCode}
        AND (JOURNAL."RefDate" BETWEEN '${startDate}' AND '${endDate}') 
        AND (LEFT(JOURNAL."Account",10) = '1.01.02.11' AND RIGHT(JOURNAL."Account",2) <> '99')
        ${project ? ` AND JOURNAL."Project" = '${project}' ` : ' '}
          
        GROUP BY
          (LEFT(JOURNAL."Account",8) || '11.99')
        , JOURNAL."ProfitCode"
        , '1.01.02.02.' || RIGHT(JOURNAL."Account",2)
        , '1.02.05.01.' || RIGHT(JOURNAL."Account",2)
      )
      GROUP BY
      "ProfitCode",
      "Account",
      "CostAccount",
      "InvAccount"
    
		`;

    try {
      const result = await this.exec(query);
      return result.data;
    } catch (exception) {
      return null;
    }

  }
  
  async getProductionSummary(item: string, project: string, businessPlaceCode: number, startDate: string): Promise<ProductionSummary[]> {

    const query = `
    SELECT 
      SUM(Item."Quantity") AS "Quantity",
      Item."WhsCode" 
    FROM 
      ${this.databaseName}.IGN1 Item
      
      INNER JOIN ${this.databaseName}.OIGN Entrada
      ON Entrada."DocEntry" = Item."DocEntry"
    WHERE 
      Item."ItemCode" = '${item}'
    --AND Item."DocDate" <= '${startDate}'
    AND Entrada."U_ALFA_RequestNumber" like '${businessPlaceCode}-${project}-%'
    AND Entrada."BPLId" = ${businessPlaceCode}
    GROUP BY
      Item."WhsCode"       
		`;

    try {
      const result = await this.exec(query);
      return result.data;
    } catch (exception) {
      return null;
    }

  }

  async getRefDateConfigCost(){
    const query = `
        SELECT 
             TOP 1
             "U_REFDATE_START" AS "STARTDATE",
             "U_REFDATE_END" AS "ENDDATE"
         FROM
             ${this.databaseName}."@ALFA_REFDATE_CONFIG"
      `;
    try{
      const result = await this.exec(query);
      return result.data;
    }catch(exception){
      return null;
    }
  }
  
  async getCostSummaryHarvest(costCenters: string[], project: string, businessPlaceCode: number, startDate: string, endDate: string): Promise<CostCenterSummary[]> {
    // -- Account que estava fixo 1.01.02.02
    const query = `
    SELECT
      SUM("Balance") AS "Balance",
      --"ProfitCode",
      "Account"
    FROM (       
        SELECT 
          SUM(JOURNAL."Debit") - SUM(JOURNAL."Credit")	                      AS "Balance",
          --JOURNAL."ProfitCode"          						                          AS "ProfitCode",
          (LEFT(JOURNAL."Account",8) || '02.99')                           		AS "Account"
        FROM
          ${this.databaseName}.JDT1 JOURNAL
        WHERE
            JOURNAL."ProfitCode" IN (${costCenters.map(c => `'${c}'`).join(',')})
        AND JOURNAL."BPLId" = ${businessPlaceCode}
        --AND (JOURNAL."RefDate" BETWEEN '${startDate}' AND '${endDate}') 
        AND (LEFT(JOURNAL."Account",10) = (SELECT TOP 1 "U_ALFA_ACCOUNT" FROM ${this.databaseName}."@ALFA_ACCOUNT_CONFIG") AND RIGHT(JOURNAL."Account",2) <> '99')
          
        GROUP BY
          JOURNAL."Account"
        --, JOURNAL."ProfitCode"
      )
      GROUP BY
      --"ProfitCode",
      "Account"    
      HAVING 
      	SUM("Balance") > 0
    `;
    
    try {
      const result = await this.exec(query);
      return result.data;
    } catch (exception) {
      return null;
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
			DECLARE LAST_UPDATE		SECONDDATE;
      
      TOTAL := 0;
      IMPORTED := 0;
      PERCENTUAL := 0;
      
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OPRC) INTO TOTAL FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OPRC WHERE "U_ALFA_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
			
			SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OPRC WHERE "U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
			
			SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.COST_CENTER} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
			
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
