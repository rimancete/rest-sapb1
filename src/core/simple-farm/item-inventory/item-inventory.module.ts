import { Module } from '@nestjs/common';
import { SimpleFarmItemInventoryService } from './item-inventory.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmItemInventoryService],
	exports: [SimpleFarmItemInventoryService]
})

export class SimpleFarmItemInventoryModule { }
