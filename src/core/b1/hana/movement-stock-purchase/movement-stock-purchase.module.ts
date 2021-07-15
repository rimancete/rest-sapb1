import { Module } from '@nestjs/common';
import { HanaMovementStockPurchaseService } from './movement-stock-purchase.service';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [DatabaseModule],
	providers: [HanaMovementStockPurchaseService],
	exports: [HanaMovementStockPurchaseService]
})

export class HanaMovementStockPurchaseModule { }
