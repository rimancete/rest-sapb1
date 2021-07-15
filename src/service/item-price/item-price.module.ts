import { Module } from '@nestjs/common';
import { ItemPriceService } from './item-price.service';
import { SimpleFarmItemPriceModule } from '../../core/simple-farm/item-price/item-price.module';
import { HanaItemPriceModule } from '../../core/b1/hana/item-price/item-price.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaItemPriceModule, SimpleFarmItemPriceModule, LogsModule],
	providers: [ItemPriceService],
	exports: [ItemPriceService]
})
export class ItemPriceModule { }
