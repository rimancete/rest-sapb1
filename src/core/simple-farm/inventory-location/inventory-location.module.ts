import { Module } from '@nestjs/common';
import { SimpleFarmInventoryLocationService } from './inventory-location.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmInventoryLocationService],
	exports: [SimpleFarmInventoryLocationService]
})

export class SimpleFarmInventoryLocationModule { }
