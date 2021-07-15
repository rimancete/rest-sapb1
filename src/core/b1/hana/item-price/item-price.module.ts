import { Module } from '@nestjs/common';
import { HanaItemPriceService } from './item-price.service';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [DatabaseModule],
	providers: [HanaItemPriceService],
	exports: [HanaItemPriceService]
})

export class HanaItemPriceModule { }
