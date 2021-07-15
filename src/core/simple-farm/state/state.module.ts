import { Module } from '@nestjs/common';
import { SimpleFarmStateService } from './state.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmStateService],
	exports: [SimpleFarmStateService]
})

export class SimpleFarmStateModule { }
