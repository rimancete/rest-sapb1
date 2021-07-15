import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { SupplierClient } from '../../../../core/simple-farm/supplier-client/interfaces';
import * as _ from 'lodash';
import { SupplierClientAddresses } from 'src/core/simple-farm/supplier-client/interfaces';

@Injectable()
export class HanaBusinessPartnersService extends DatabaseService<any> {

  getNotIntegrated(): Promise<SupplierClient[]> {
    return this.execute(`SELECT TOP 10
                                PN."CardCode" 											                          AS "Code",
                                PN."CardName"                          					              AS "Name", 
                                PN."Phone1"                            					              AS "Phone",
                                PN."E_Mail"                            					              AS "Email",
                                CASE WHEN PN."CardType" = 'C' THEN 0 ELSE 2 END     		      AS "Type",
                                CASE WHEN Fiscal."TaxId0" IS NULL THEN 1 ELSE 2 END		        AS "PeopleType",
                                CASE WHEN PN."frozenFor" = 'Y' THEN 'false' ELSE 'true' END	  AS "Active",
                                PN."ZipCode"		                     					                AS "Zipcode",
                                City."Code"                            					              AS "CityCode",
                                Addr."Block"                                                  AS "Neighborhood",
                                Addr."StreetNo"                                               AS "PlaceNumber",
                                PN."Notes"                                                    AS "AddressObs",
                                PN."Address"    	                     					              AS "Street",
                                NULLIF(Fiscal."TaxId0",'')           				                  AS "CNPJ",
                                NULLIF(Fiscal."TaxId4",'')                                    AS "CPF",
                                NULLIF(Fiscal."TaxId1",'')                                    AS "IE"

                              FROM ${this.databaseName}.OCRD PN 

                              INNER JOIN (
                                SELECT 
                                  "CardCode",
                                  MAX("TaxId0")	  AS "TaxId0",
                                  MAX("TaxId4") 	AS "TaxId4",
                                  MAX("TaxId1")	  AS "TaxId1"
                                FROM ${this.databaseName}.CRD7
                                GROUP BY "CardCode") Fiscal 
                              ON PN."CardCode" = Fiscal."CardCode"
                              
                              INNER JOIN ${this.databaseName}.OCNT City
                              ON PN."County" = City."AbsId"
                              AND City."U_ALFA_Integrated" = 'Y'
                              

                                  INNER JOIN (
                                SELECT 
                                  "CardCode",
                                MAX("Block") AS "Block",
                                Max("StreetNo") AS "StreetNo"
                                FROM ${this.databaseName}.CRD1
                                GROUP BY "CardCode") Addr 
                              ON PN."CardCode" = Addr."CardCode"
                              
                              
                              
                              WHERE 
                                PN."U_ALFA_Integrated" = 'N' -- AND PN."CreateDate" >= '2020-08-01'
                                `);
  }

  async setIntegrated(record: SupplierClient): Promise<DatabaseResponse<any>> {
    const query = `UPDATE ${this.databaseName}.OCRD SET "U_ALFA_Integrated" = 'Y' WHERE "CardCode" = '${record.Code}'`;
    return await this.execute(query);
  }


  async getAllAdress(partner: string):  Promise<SupplierClientAddresses[]> {
    // WHERE T0."U_ALFA_Integrated" = 'N'
    return this.execute(`SELECT 
                            T1."LineNum"         AS "Code",
                            T2."Code" 		    AS "CityCode",
                            T1."Street"           AS "Street",
                          -- T1."City"             AS "City",
                          T1."Block"               AS "Neighborhood",
                          T1."StreetNo"            AS "PlaceNumber",
                          T0."Notes"               AS "AddressObs",   
                          T0."ZipCode"             AS "Zipcode",                       
                          IFNULL (Fiscal."TaxId0",IFNULL(Fiscal."TaxId4",'00.000.000/0000-00')) AS "CNPJ"
                          FROM 
                            ${this.databaseName}.OCRD T0 
                          INNER JOIN 
                            ${this.databaseName}.CRD1 T1 
                          ON T0."CardCode" = T1."CardCode" 
                          INNER JOIN 
                            ${this.databaseName}.OCNT T2 
                          ON T1."County" = T2."AbsId"
                              INNER JOIN (
                        SELECT 
                        "CardCode",
                        MAX("TaxId0")	  AS "TaxId0",
                        MAX("TaxId4") 	AS "TaxId4",
                        MAX("TaxId1")	  AS "TaxId1"
                        FROM ${this.databaseName}.CRD7
                        GROUP BY "CardCode") Fiscal 
                        ON T0."CardCode" = Fiscal."CardCode"

                        WHERE 
                          T0."CardCode" = '${partner}'`);
  }


  async getLastUpdateAdress(partner: string): Promise<DatabaseResponse<any>> {
    // WHERE T0."U_ALFA_Integrated" = 'N'
    return this.exec(`SELECT 
                      T0."CardCode"         AS "Code",
                      T2."Code" 			      AS "CityCode",
                      T1."Street"           AS "Street",
                      T1."City"             AS "City"
                    FROM 
                      ${this.databaseName}.OCRD T0 
                    INNER JOIN 
                      ${this.databaseName}.CRD1 T1 
                    ON T0."CardCode" = T1."CardCode" 
                    INNER JOIN 
                      ${this.databaseName}.OCNT T2 
                    ON T1."County" = T2."AbsId"

                  WHERE 
                    T0."CardCode" = '${partner}'`);
  }

  async getBranch(branch: number): Promise<any> {

    // const query = `SELECT Branch."BPLId", Branch."DflWhs" FROM ${this.databaseName}.OBPL Branch WHERE Branch."BPLId" = '4'`;
    const query = `SELECT Branch."BPLId", Branch."DflWhs" FROM ${this.databaseName}.OBPL Branch WHERE Branch."BPLId" = '9'`;

    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }

  }

  async getUser(username: string): Promise<any> {
    const query = ` SELECT USER_CODE FROM ${this.databaseName}.OUSR WHERE USER_CODE  = '${username}' `
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }

  async getPartner(partner: string): Promise<any> {

    const query = `SELECT Partner."CardCode" FROM ${this.databaseName}.OCRD Partner WHERE Partner."CardCode" = '${partner}'`;

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
    
      DECLARE TOTAL			INTEGER;
      DECLARE IMPORTED		INTEGER;
      DECLARE NOTIMPORTED		INTEGER;
      DECLARE PERCENTUAL		DECIMAL(18,2);
      
      TOTAL := 0;
      IMPORTED := 0;
      PERCENTUAL := 0;
      
    SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCRD) INTO TOTAL FROM DUMMY;
    
    SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCRD WHERE "U_ALFA_Integrated" = 'Y') INTO IMPORTED FROM DUMMY;
    
    SELECT (SELECT COUNT(*) FROM ${this.databaseName}.OCRD WHERE "U_ALFA_Integrated" = 'N') INTO NOTIMPORTED FROM DUMMY;
    
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
