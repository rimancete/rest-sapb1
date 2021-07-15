import { Module } from '@nestjs/common';
import { HanaRequestSituationHistoryService } from './request-situation-history.service';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [DatabaseModule],
	providers: [HanaRequestSituationHistoryService],
	exports: [HanaRequestSituationHistoryService]
})

export class HanaRequestSituationHistoryModule { }
