import { Module } from '@nestjs/common';
import { ItemFamilyService } from './item-family.service';
import { SimpleFarmItemFamilyModule } from '../../core/simple-farm/item-family/item-family.module';
import { HanaItemFamilyModule } from '../../core/b1/hana/item-family/item-family.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaItemFamilyModule, SimpleFarmItemFamilyModule, LogsModule],
	providers: [ItemFamilyService],
	exports: [ItemFamilyService],
})
export class ItemFamilyModule { }
