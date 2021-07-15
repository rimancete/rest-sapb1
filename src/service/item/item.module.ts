import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { SimpleFarmItemModule } from '../../core/simple-farm/item/item.module';
import { HanaItemModule } from '../../core/b1/hana/item/item.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaItemModule, SimpleFarmItemModule, LogsModule],
	providers: [ItemService],
	exports: [ItemService],
})
export class ItemModule { }
