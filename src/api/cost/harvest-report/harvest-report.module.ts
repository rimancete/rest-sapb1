import { Module } from '@nestjs/common';
import { HarvestReportService } from './harvest-report.service';
import { HarvestReportController } from './harvest-report.controller';
import { JournalEntriesRequestsModule } from '../../../core/b1/service-layer/journal-entries/journal-requests.module'
import { HanaCostCenterModule } from '../../../core/b1/hana/cost-center/cost-center.module'
import { HanaBranchModule } from '../../../core/b1/hana/branch/branch.module'
import { HanaProjectModule } from '../../../core/b1/hana/project/project.module'
import { LoginModule } from '../../../core/b1/service-layer/login/login.module';
import { MaterialRevoluationRequestsModule } from '../../../core/b1/service-layer/material-revaluation/material-revaluation.module';
import { HanaMaterialRevoluationModule } from '../../../core/b1/hana/material-revaluation/material-revaluation.module';
import { HanaLogModule } from '../../../core/b1/hana/log/log.module';
import { LogsModule } from '../../../core/logs/logs.module';
import { HanaItemModule } from '../../../core/b1/hana/item/item.module';

@Module({
	imports: [LoginModule, JournalEntriesRequestsModule, MaterialRevoluationRequestsModule, HanaItemModule, HanaProjectModule, HanaBranchModule, HanaCostCenterModule, LogsModule],
	providers: [HarvestReportService],
	controllers: [HarvestReportController]
})
export class HarvestReportModule { }