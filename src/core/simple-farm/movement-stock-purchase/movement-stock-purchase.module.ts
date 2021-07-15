import { Module } from '@nestjs/common';
import { SimpleFarmMovementStockPurchaseService } from './movement-stock-purchase.service'
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmMovementStockPurchaseService],
	exports: [SimpleFarmMovementStockPurchaseService]
})

export class SimpleFarmMovementStockPurchaseModule { }
