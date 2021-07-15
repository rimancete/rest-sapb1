import { Module } from '@nestjs/common';
import { HanaItemInventoryService } from './item-inventory.service';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [DatabaseModule],
	providers: [HanaItemInventoryService],
	exports: [HanaItemInventoryService]
})

export class HanaItemInventoryModule { }
