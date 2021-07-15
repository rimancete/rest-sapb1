import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../logs/interface';
import { Contract } from 'src/core/simple-farm/contract/interfaces';
import * as _ from 'lodash';
import { HanaSale } from './interface';

@Injectable()
export class HanaSaleService extends DatabaseService<any> {

  async getOrder(id: string): Promise<any> {

    const query = `
		SELECT 	
      dr."DocEntry",
			dr."BPLId",
      dr."Comments",      
			dr."DocDate",
			dr."DocDueDate",
			dr."Ref2" ,
			dr."CardCode",
			dr."Email" ,
			dr."U_ALFA_RequestNumber",
			r1."LineNum"
		FROM ${this.databaseName}.ORDR dr
		INNER JOIN ${this.databaseName}.RDR1 r1
		ON dr."DocEntry" = r1."DocEntry"
		WHERE
			dr."DocNum" = '${id}'
		
		 		                      
		`;
    return await this.execute(query);
  }

  async getItems(id: string): Promise<any> {

    const itens = `
					  SELECT 
						"OcrCode",
						"ItemCode"
					  FROM ${this.databaseName}.RDR1 
					  WHERE "DocEntry" = '${id}'
					`;
    return await this.execute(itens);
  }


  async getLine(itemCode, docNum): Promise<any> {
    const query = `
                      SELECT 
                            "LineNum" 
                        FROM 
                          ${this.databaseName}.RDR1 LINE
                        INNER JOIN 
                          ${this.databaseName}.ORDR ORDERS 
                        ON 
                          LINE."DocEntry" = ORDERS."DocEntry" 
                        WHERE 
                          ORDERS."DocNum" = '${docNum}' 
                        AND 
                          LINE."ItemCode" = '${itemCode}'
                  `
    return await this.execute(query);
  }

  async getByReferenceNum(reference: string): Promise<HanaSale> {

    const query = `
      SELECT DISTINCT
          ORDR."DocEntry",
          ORDR."DocNum",
          CASE WHEN (SUM(RDR1."Quantity") - SUM(RDR1."OpenInvQty")) = 0 THEN 1 ELSE 0 END  AS "Open"
      FROM 
          ${this.databaseName}.ORDR 

          INNER JOIN ${this.databaseName}.RDR1
          ON RDR1."DocEntry" = ORDR."DocEntry"
      WHERE 
          "U_ALFA_pedidoId" = '${reference}' 
      AND "CANCELED" = 'N'
      GROUP BY
        ORDR."DocEntry",
        ORDR."DocNum"
    `;
    
    try {
      const result = await this.execute(query);
      return _.first(result);
    } catch (exception) {
      return null;
    }

  }

  async getByDocNum(orderNum: string): Promise<HanaSale> {

    const query = `
    SELECT 
      "CardCode",
      "DocEntry",
      "BPLId"       
    FROM 
      ${this.databaseName}.ORDR 
    WHERE
        "DocNum" = '${orderNum}'
    AND "CANCELED" = 'N'
    AND "U_ALFA_pedidoId" IS NOT NULL
    `;

    try {
      const result = await this.execute(query);
      return _.first(result);
    } catch (exception) {
      return null;
    }

  }

  async getOrderLineNum(docNum: string): Promise<number> {
    const query = `
    SELECT 
        "LineNum" 
    FROM 
      ${this.databaseName}.RDR1 LINE

    INNER JOIN ${this.databaseName}.ORDR ORDERS 
    ON LINE."DocEntry" = ORDERS."DocEntry" 

    WHERE 
      ORDERS."DocNum" = '${docNum}' 
    `
    try {
      const result = await this.execute(query);
      return _.get(_.first(result), 'LineNum');
    } catch (exception) {
      return null;
    }
  }

}
