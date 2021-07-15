import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { Log } from './intefaces';
import * as _ from 'lodash';

@Injectable()
export class HanaLogService extends DatabaseService<any> {

	insertLog(log: Log) {

		const query = `
                      INSERT INTO 
                          ALFA_LOGS."LOGS"  (
                                              LOGDATE, 
                                              LOGTYPECODE, 
                                              COMPANY, 
                                              MODULE, 
                                              MESSAGE, 
                                              FULLMESSAGE, 
                                              KEY, 
                                              REQUESTOBJECT, 
                                              RESPONSEOBJECT
                                            )
                                    VALUES  (
                                              CURRENT_TIMESTAMP, 
                                              ${log.LOGTYPECODE}, 
                                              '${this.databaseName}', 
                                              ${log.MODULE}, 
                                              '${(log.MESSAGE !== undefined ? log.MESSAGE.toString().replace(/'/g, '') : '')}', 
                                              '${(log.FULLMESSAGE !== undefined ? log.FULLMESSAGE.toString().replace(/'/g, '') : '')}', 
                                              '${(log.KEY !== undefined ? log.KEY.toString() : '')}', 
                                              '${JSON.stringify(log.REQUESTOBJECT).replace(/'/g, '')}', 
                                              '${JSON.stringify(log.RESPONSEOBJECT).replace(/'/g, '')}'
                                            );
		
    `;
    
		return this.execute(query);

	}

	getLogs(): Promise<DatabaseResponse<Log>> {

		return this.exec(`
                    SELECT CODE
                          ,LOGTYPECODE
                          ,COMPANY
                          ,MODULE
                          ,KEY
                          ,MESSAGE
                          ,LOGDATE
                          ,TO_VARCHAR(LOGDATE,'YYYY-MM-DD') LOGDATE_FORMAT 
                    FROM 
                    ALFA_LOGS."LOGS";
		`);

	}


	getLogDetails(log: Log): Promise<DatabaseResponse<Log>> {
		return this.exec(`
                      SELECT *                       
                      FROM 
                        ALFA_LOGS."LOGS"
                      WHERE CODE = ${log.Code} ;		
    `);
	}

	getApiOverview(): Promise<DatabaseResponse<any>> {
		return this.exec(`
    SELECT (select MAX(LOGDATE) from ALFA_LOGS.LOGS WHERE MODULE = A.MODULE AND LOGTYPECODE = 2) LASTSUCCESS,(SELECT COUNT(*) FROM ALFA_LOGS.LOGS WHERE MODULE = A.MODULE AND LOGDATE between NOW() and (SELECT ADD_SECONDS (TO_TIMESTAMP (now()), 60*-480) from dummy)) AMOUNT_LAST_HOURS,(SELECT NAME FROM ALFA_LOGS.MODULES WHERE CODE = A.MODULE) MODULE from ALFA_LOGS.LOGS A group by A.MODULE
    `)
	}

	getApiGraph(): Promise<DatabaseResponse<any>> {
		return this.exec(`SELECT (select COUNT(TO_VARCHAR(LOGDATE,'DD-MM-YYYY')) from ALFA_LOGS.LOGS where module = A.MODULE AND TO_VARCHAR(LOGDATE,'DD-MM-YYYY') = TO_VARCHAR(A.LOGDATE,'DD-MM-YYYY')) Quantidade, (SELECT NAME FROM ALFA_LOGS.MODULES WHERE CODE = A.MODULE) MODULO,TO_VARCHAR(A.LOGDATE,'DD-MM-YYYY') DATA from ALFA_LOGS.LOGS  A WHERE A.LOGDATE between ADD_DAYS (TO_TIMESTAMP (now()), -7) and CURRENT_DATE group by A.MODULE,TO_VARCHAR(A.LOGDATE,'DD-MM-YYYY')`)
	}

}
