import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../../core/logs/interface';
import { Branch } from './intefaces/index';
import * as _ from 'lodash';

@Injectable()
export class HanaBranchService extends DatabaseService<any> {

  async getNotIntegrated(): Promise<Branch[]> {

    const query = `
      SELECT
        Branch."BPLId" 					          AS "Code"
      , Branch."BPLId"                    AS "CodeERP"
      , Branch."BPLName" 			        	  AS "Name"
      , IFNULL(Branch."AliasName",Branch."BPLName")			      	  AS "TradeName"
      , Company."BPLId"			        	    AS "CompanyCode"
      , Branch."StreetNo" 				        AS "PlaceNumber" 
      , Branch."Building" 				        AS "AddressObs"
      , Branch."Block" 					          AS "Neighborhood"
      , City."Code"                       AS "CityCode"
      , Branch."Street"                   AS "Street"
      , Branch."ZipCode"                  AS "ZipCode"  
      
      FROM ${this.databaseName}.OBPL Branch

      INNER JOIN ${this.databaseName}.OCNT City 
      ON IFNULL(NULLIF(Branch."County",''),-1) = City."AbsId"
      AND City."U_ALFA_Integrated" = 'Y'
            
      INNER JOIN ${this.databaseName}.OBPL Company
      ON Company."U_ALFA_Integrated" = 'Y'
      AND Company."MainBPL" = 'Y'
      
      WHERE 
          Branch."MainBPL" = 'N' 
      AND Branch."U_ALFA_Integrated" = 'N'
			`;

    return await this.execute(query);
  }

  async setIntegrated(record: Branch): Promise<DatabaseResponse<any>> {
    const query = `UPDATE ${this.databaseName}.OBPL SET "U_ALFA_Integrated" = 'Y' WHERE "BPLId" = '${record.Code}'`;
    return await this.execute(query);
  }

  async getBPLId(id: string): Promise<Branch> {

    const query = `
      SELECT
        Branch."BPLId" 	      
      FROM 
        ${this.databaseName}.OBPL Branch      
      WHERE 
          Branch."BPLId" = '${id}'
      `;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }

  }

  getIntegrationValues(): Promise<DatabaseResponse<Branch[]>> {

    return this.exec(`
        DO
        BEGIN
        
          DECLARE TOTAL_BRANCH	INTEGER;
          DECLARE IMPORTED		INTEGER;
          DECLARE NOTIMPORTED		INTEGER;
          DECLARE PERCENTUAL		DECIMAL(18,2);
          DECLARE LAST_UPDATE		SECONDDATE;
          
          TOTAL_BRANCH := 0;
          IMPORTED := 0;
          PERCENTUAL := 0;
          
        SELECT (
          SELECT
          count(*)
            
            FROM ${this.databaseName}.OBPL Branch
      
            INNER JOIN ${this.databaseName}.OCNT City 
            ON IFNULL(NULLIF(Branch."County",''),-1) = City."AbsId"
            AND City."U_ALFA_Integrated" = 'Y'
                  
            INNER JOIN ${this.databaseName}.OBPL Company
            ON Company."U_ALFA_Integrated" = 'Y'
            AND Company."MainBPL" = 'Y'
            
            WHERE 
                Branch."MainBPL" = 'N'

        ) INTO TOTAL_BRANCH FROM DUMMY;
        
        SELECT (
          
          SELECT
          count(*)
            
            FROM ${this.databaseName}.OBPL Branch
      
            INNER JOIN ${this.databaseName}.OCNT City 
            ON IFNULL(NULLIF(Branch."County",''),-1) = City."AbsId"
            AND City."U_ALFA_Integrated" = 'Y'
                  
            INNER JOIN ${this.databaseName}.OBPL Company
            ON Company."U_ALFA_Integrated" = 'Y'
            AND Company."MainBPL" = 'Y'
            
            WHERE 
                Branch."MainBPL" = 'N' 
            AND Branch."U_ALFA_Integrated" = 'Y'
          ) INTO IMPORTED FROM DUMMY;
        
        SELECT (
          
          SELECT
          count(*)
            
            FROM ${this.databaseName}.OBPL Branch
      
            INNER JOIN ${this.databaseName}.OCNT City 
            ON IFNULL(NULLIF(Branch."County",''),-1) = City."AbsId"
            AND City."U_ALFA_Integrated" = 'Y'
                  
            INNER JOIN ${this.databaseName}.OBPL Company
            ON Company."U_ALFA_Integrated" = 'Y'
            AND Company."MainBPL" = 'Y'
            
            WHERE 
                Branch."MainBPL" = 'N' 
            AND Branch."U_ALFA_Integrated" = 'N'
            AND Branch."U_ALFA_Retry" < 3

        ) INTO NOTIMPORTED FROM DUMMY;

				SELECT (SELECT MAX(LOGDATE) FROM ALFA_LOGS.LOGS WHERE "MODULE" = ${LogModule.BRANCH} AND "LOGTYPECODE" = ${LogType.SUCCESS}) INTO LAST_UPDATE FROM DUMMY;
      
        PERCENTUAL := (IMPORTED / TOTAL_BRANCH) * 100;
        
        SELECT 
          :TOTAL_BRANCH AS "Total", 
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
