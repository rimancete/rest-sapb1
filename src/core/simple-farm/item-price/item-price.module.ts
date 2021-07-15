import { Module } from '@nestjs/common';
import { SimpleFarmItemPriceService } from './item-price.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmItemPriceService],
	exports: [SimpleFarmItemPriceService]
})

export class SimpleFarmItemPriceModule { }
