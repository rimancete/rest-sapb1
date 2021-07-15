import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { InventoryGenEntry } from './interfaces';

@Injectable()
export class InventoryGenEntriesService extends ODataService<InventoryGenEntry> {

	constructor() {
		super();
		this.path = "InventoryGenEntries";
	}

	setTypeExit() {
		this.path = "InventoryGenExits";
	}

	setTypeEntry() {
		this.path = "InventoryGenEntries";
	}
	
	setTypeDraftEntry() {
		this.path = "Drafts";
	}

}
