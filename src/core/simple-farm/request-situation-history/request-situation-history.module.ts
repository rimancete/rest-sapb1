import { Module } from '@nestjs/common';
import { SimpleFarmRequestSituationHistoryService } from './request-situation-history.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmRequestSituationHistoryService],
	exports: [SimpleFarmRequestSituationHistoryService]
})

export class SimpleFarmRequestSituationHistoryModule { }
