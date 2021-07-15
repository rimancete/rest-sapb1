import { Module } from '@nestjs/common';
import { SimpleFarmCostCenterService } from './cost-center.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmCostCenterService],
	exports: [SimpleFarmCostCenterService]
})

export class SimpleFarmCostCenterModule { }
