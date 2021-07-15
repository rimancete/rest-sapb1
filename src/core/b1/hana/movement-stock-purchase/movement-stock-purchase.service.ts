import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HanaMovementStockPurchaseService extends DatabaseService<any> {

	getNotIntegrated(): Promise<any[]> {
		return this.execute(`  
   
    `);

	}

	setIntegrated(itemCode: string, date: string, warehouse: string): Promise<DatabaseResponse<any>> {

		return this.exec(`
	
		`);

	}

	getIntegrationValues(): Promise<DatabaseResponse<any>> {

		return this.exec(`
	
		  `
		);
	}



}
