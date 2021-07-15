import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import * as _ from 'lodash';

@Injectable()
export class HanaItemService extends DatabaseService<any> {

  getNotIntegrated(): Promise<any[]> {

    return this.execute(`
    SELECT 
    Item."ItemCode"                 AS "Code"
    ,Company."BPLId"                 AS "CompanyCode"
    ,Item."ItemName"                 AS "Description"
    ,Item."FrgnName"                 AS "ShortDescription"
    ,CAST(Family."Code" AS NVARCHAR) AS "FamilyCode"
    ,CAST(Item."ItmsGrpCod" AS NVARCHAR) AS "GroupCode"
    ,(CASE WHEN Item."validFor" = 'Y' THEN true else false END) AS "Active"
    ,Item."InvtryUom"  AS "UnitCode"
    ,Item."InvtryUom"  AS "UnitApplicationCode"
    ,(CASE WHEN Item."ItemClass" = 1 THEN 2 ELSE 1 END) AS "Type"
    ,(CASE WHEN Item."ItemClass" = 1 THEN 3
           ELSE (CASE WHEN Item."InvntItem" = 'Y' THEN 1 ELSE 2 END)
      END) AS "TypeControl"
    ,Item."SuppCatNum" AS "ManufacturerCode"

    FROM ${this.databaseName}.OITM Item 

    INNER JOIN ${this.databaseName}."@ALFA_SUBGROUP" Family 
    ON Item."U_ALFA_Subgroup" = Family."Code"
    AND Family."U_Integrated" = 'Y'

    INNER JOIN ${this.databaseName}.OITB ItemGroup 
    ON ItemGroup."ItmsGrpCod" = Item."ItmsGrpCod"
    AND ItemGroup."U_ALFA_Integrated" = 'Y'
    AND ItemGroup."U_ALFA_IntegracaoSF" = 'Y'
    
    LEFT JOIN ${this.databaseName}.OUGP UnitMeasurementGroup
    ON Item."UgpEntry" = UnitMeasurementGroup."UgpEntry"
    AND Item."UgpEntry" <> -1
    
    LEFT JOIN ${this.databaseName}.OUOM UnitMeasurementWithgroup
    ON UnitMeasurementWithgroup."UomEntry" = Item."IUoMEntry"
    AND UnitMeasurementWithgroup."U_ALFA_Integrated" = 'Y'
    AND Item."UgpEntry" <> -1
    		
    LEFT JOIN ${this.databaseName}.OUOM UnitMeasurement  
    ON UnitMeasurement."UomCode" = Item."InvntryUom"
    AND UnitMeasurement."U_ALFA_Integrated" = 'Y'
          
    INNER JOIN ${this.databaseName}.OBPL Company
    ON Company."U_ALFA_Integrated" = 'Y'
    AND Company."MainBPL" = 'Y'    

    WHERE
        Item."U_ALFA_Integrated" = 'N'
    AND Item."U_ALFA_Retry" < 3
    AND ((Item."UgpEntry" <> -1 AND UnitMeasurementWithgroup."UomCode" IS NOT NULL) OR 
        (Item."UgpEntry" = -1 AND UnitMeasurement."UomCode" IS NOT NULL))
	`);

  }

  async setIntegrated(record: any): Promise<DatabaseResponse<any>> {
    const query = `UPDATE ${this.databaseName}.OITM SET "U_ALFA_Integrated" = 'Y' WHERE "ItemCode" = '${record.Code}'`;
    return await this.execute(query);
  }

  async getItemCostCenters(itemCode: string): Promise<any> {

    const query = `SELECT 
                    CC."U_ALFA_CodCC" AS "Code"
                  FROM 
                    ${this.databaseName}."@ALFA_ITENS" ITEM

                    INNER JOIN ${this.databaseName}."@ALFA_CCUSTO" CC
                    ON CC."DocEntry" = ITEM."DocEntry"

                  WHERE 
                    ITEM."U_ALFA_CodItem" = '${itemCode}'`;
    try {
      const result = await this.exec(query);
      return result.data;
    } catch (exception) {
      return null;
    }
  }

  async getItem(code: string): Promise<any> {

    const query = `SELECT 
                    "ItemCode",
                    "U_ALFA_CCApropriacao",
                    "U_ALFA_ContaApropriacao",
                    "ManBtchNum",
                    "U_ALFA_Comprador",
                    "PrchseItem"
                  FROM 
                    ${this.databaseName}.OITM 
                  WHERE 
                    "ItemCode" = '${code}'`;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }
  async getItemMeasureUnit(code: string): Promise<any> {

    const query = `SELECT 
                item."NumInSale",
                un."UomCode",
                un."UomEntry"
              FROM 
                ${this.databaseName}.OITM item
              INNER JOIN ${this.databaseName}.OUOM un
              ON un."UomName" = item."SalUnitMsr"
              WHERE 
                "ItemCode" = '${code}'`;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }
  async getItemCost(code: string, warehouse: string): Promise<any> {

    const query = `SELECT 
                    "AvgPrice"
                  FROM 
                    ${this.databaseName}.OITW 
                  WHERE 
                    "ItemCode" = '${code}' AND "WhsCode" = '${warehouse}'`;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }

  async getDocEntry(itemCode: string, contract: string): Promise<any> {

    const query = `
                    SELECT 
                        p1."ItemCode" ,
                        p1."LineNum" ,
                        p1."DocEntry" 
                      FROM ${this.databaseName}.PQT1 p1
                    INNER JOIN ${this.databaseName}.OOAT o
                    ON o."AbsID" = p1."AgrNo" 
                    WHERE o."AbsID"  = '${contract}'
                    AND p1."ItemCode"  = '${itemCode}'`;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }


  async getContractItem(contractCode: string, operationCode: string): Promise<any> {

    const query = `SELECT 
                    Item."ItemCode"
                  FROM 
                    ${this.databaseName}.OAT1 ContractItem
                    
                    INNER JOIN ${this.databaseName}.OITM Item
                    ON Item."ItemCode" = ContractItem."ItemCode"
                    AND (Item."U_ALFA_Operation" = '${operationCode}' OR Item."ItemCode" = '${operationCode}')

                  WHERE 
                    ContractItem."AgrNo" = ${contractCode}`;
    try {
      console.log(query);
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }


  async getComprador(comprador: string): Promise<any> {

    const query = `SELECT 
                    IFNULL("firstName",'') || ' ' || IFNULL("lastName",'') AS "Name"
                  FROM 
                    ${this.databaseName}.OHEM 
                  WHERE 
                    "empID" = ${comprador}`;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }


  getIntegrationValues(): Promise<DatabaseResponse<any>> {

    return this.exec(`
    DO
    BEGIN
    
      DECLARE TOTAL_BRANCH	INTEGER;
      DECLARE IMPORTED		INTEGER;
      DECLARE NOTIMPORTED		INTEGER;
      DECLARE PERCENTUAL		DECIMAL(18,2);
      
      TOTAL_BRANCH := 0;
      IMPORTED := 0;
      PERCENTUAL := 0;
      
    SELECT (SELECT 
      COUNT(*)
     
         FROM ${this.databaseName}.OITM Item 
     
         INNER JOIN ${this.databaseName}."@ALFA_SUBGROUP" Family 
         ON Item."U_ALFA_Subgroup" = Family."Code"
         AND Family."U_Integrated" = 'Y'
     
         INNER JOIN ${this.databaseName}.OITB ItemGroup 
         ON ItemGroup."ItmsGrpCod" = Item."ItmsGrpCod"
         AND ItemGroup."U_ALFA_Integrated" = 'Y'
         AND ItemGroup."U_ALFA_IntegracaoSF" = 'Y'
         
         LEFT JOIN ${this.databaseName}.OUGP UnitMeasurementGroup
         ON Item."UgpEntry" = UnitMeasurementGroup."UgpEntry"
         AND Item."UgpEntry" <> -1
         
         LEFT JOIN ${this.databaseName}.OUOM UnitMeasurementWithgroup
         ON UnitMeasurementWithgroup."UomEntry" = Item."IUoMEntry"
         AND UnitMeasurementWithgroup."U_ALFA_Integrated" = 'Y'
         AND Item."UgpEntry" <> -1
             
         LEFT JOIN ${this.databaseName}.OUOM UnitMeasurement  
         ON UnitMeasurement."UomCode" = Item."InvntryUom"
         AND UnitMeasurement."U_ALFA_Integrated" = 'Y'
               
         INNER JOIN ${this.databaseName}.OBPL Company
         ON Company."U_ALFA_Integrated" = 'Y'
         AND Company."MainBPL" = 'Y'    
     
         WHERE ((Item."UgpEntry" <> -1 AND UnitMeasurementWithgroup."UomCode" IS NOT NULL) OR 
             (Item."UgpEntry" = -1 AND UnitMeasurement."UomCode" IS NOT NULL))) INTO TOTAL_BRANCH FROM DUMMY;
    
    SELECT (SELECT 
      COUNT(*)
     
         FROM ${this.databaseName}.OITM Item 
     
         INNER JOIN ${this.databaseName}."@ALFA_SUBGROUP" Family 
         ON Item."U_ALFA_Subgroup" = Family."Code"
         AND Family."U_Integrated" = 'Y'
     
         INNER JOIN ${this.databaseName}.OITB ItemGroup 
         ON ItemGroup."ItmsGrpCod" = Item."ItmsGrpCod"
         AND ItemGroup."U_ALFA_Integrated" = 'Y'
         AND ItemGroup."U_ALFA_IntegracaoSF" = 'Y'
         
         LEFT JOIN ${this.databaseName}.OUGP UnitMeasurementGroup
         ON Item."UgpEntry" = UnitMeasurementGroup."UgpEntry"
         AND Item."UgpEntry" <> -1
         
         LEFT JOIN ${this.databaseName}.OUOM UnitMeasurementWithgroup
         ON UnitMeasurementWithgroup."UomEntry" = Item."IUoMEntry"
         AND UnitMeasurementWithgroup."U_ALFA_Integrated" = 'Y'
         AND Item."UgpEntry" <> -1
             
         LEFT JOIN ${this.databaseName}.OUOM UnitMeasurement  
         ON UnitMeasurement."UomCode" = Item."InvntryUom"
         AND UnitMeasurement."U_ALFA_Integrated" = 'Y'
               
         INNER JOIN ${this.databaseName}.OBPL Company
         ON Company."U_ALFA_Integrated" = 'Y'
         AND Company."MainBPL" = 'Y'    
     
         WHERE
             Item."U_ALFA_Integrated" = 'Y'
         AND ((Item."UgpEntry" <> -1 AND UnitMeasurementWithgroup."UomCode" IS NOT NULL) OR 
             (Item."UgpEntry" = -1 AND UnitMeasurement."UomCode" IS NOT NULL))) INTO IMPORTED FROM DUMMY;
    
    SELECT (SELECT 
      COUNT(*)
     
         FROM ${this.databaseName}.OITM Item 
     
         INNER JOIN ${this.databaseName}."@ALFA_SUBGROUP" Family 
         ON Item."U_ALFA_Subgroup" = Family."Code"
         AND Family."U_Integrated" = 'Y'
     
         INNER JOIN ${this.databaseName}.OITB ItemGroup 
         ON ItemGroup."ItmsGrpCod" = Item."ItmsGrpCod"
         AND ItemGroup."U_ALFA_Integrated" = 'Y'
         AND ItemGroup."U_ALFA_IntegracaoSF" = 'Y'
         
         LEFT JOIN ${this.databaseName}.OUGP UnitMeasurementGroup
         ON Item."UgpEntry" = UnitMeasurementGroup."UgpEntry"
         AND Item."UgpEntry" <> -1
         
         LEFT JOIN ${this.databaseName}.OUOM UnitMeasurementWithgroup
         ON UnitMeasurementWithgroup."UomEntry" = Item."IUoMEntry"
         AND UnitMeasurementWithgroup."U_ALFA_Integrated" = 'Y'
         AND Item."UgpEntry" <> -1
             
         LEFT JOIN ${this.databaseName}.OUOM UnitMeasurement  
         ON UnitMeasurement."UomCode" = Item."InvntryUom"
         AND UnitMeasurement."U_ALFA_Integrated" = 'Y'
               
         INNER JOIN ${this.databaseName}.OBPL Company
         ON Company."U_ALFA_Integrated" = 'Y'
         AND Company."MainBPL" = 'Y'    
     
         WHERE
             Item."U_ALFA_Integrated" = 'N'
         AND Item."U_ALFA_Retry" < 3
         AND ((Item."UgpEntry" <> -1 AND UnitMeasurementWithgroup."UomCode" IS NOT NULL) OR 
             (Item."UgpEntry" = -1 AND UnitMeasurement."UomCode" IS NOT NULL))) INTO NOTIMPORTED FROM DUMMY;
    
    IF :TOTAL_BRANCH  = 0
    THEN
    	PERCENTUAL := 0;
    ELSE
    	PERCENTUAL := (IMPORTED / TOTAL_BRANCH) * 100;
    END IF;
    
    SELECT 
      :TOTAL_BRANCH AS "Total", 
      :IMPORTED AS "Importadas",
      :NOTIMPORTED AS "NaoImportadas", 
      :PERCENTUAL AS "Percentual" 
    FROM DUMMY;
    
    END;
    
		  `
    );
  }
}
