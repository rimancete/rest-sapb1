import { Module } from '@nestjs/common';
import { RequestSituationHistoryService } from './request-situation-history.service';
import { SimpleFarmRequestSituationHistoryModule } from '../../core/simple-farm/request-situation-history/request-situation-history.module';
import { HanaRequestSituationHistoryModule } from '../../core/b1/hana/request-situation-history/request-situation-history.module';
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaRequestSituationHistoryModule, SimpleFarmRequestSituationHistoryModule, LogsModule],
	providers: [RequestSituationHistoryService],
	exports: [RequestSituationHistoryService]
})
export class RequestSituationHistoryModule { }
