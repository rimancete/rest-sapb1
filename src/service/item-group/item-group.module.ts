import { Module } from '@nestjs/common';
import { ItemGroupService } from './item-group.service';
import { SimpleFarmItemGroupModule } from '../../core/simple-farm/item-group/item-group.module';
import { HanaItemGroupModule } from '../../core/b1/hana/item-group/item-group.module';
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [SimpleFarmItemGroupModule, HanaItemGroupModule, LogsModule],
	providers: [ItemGroupService],
	exports: [ItemGroupService],
})
export class ItemGroupModule { }
