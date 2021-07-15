import { Module } from '@nestjs/common';
import { MatrixDistribuitionService } from './matrix-distribution.service';
import { MatrixDistribuitionController } from './matrix-distribution.controller';
import { JournalEntriesRequestsModule } from '../../../core/b1/service-layer/journal-entries/journal-requests.module'
import { HanaCostCenterModule } from '../../../core/b1/hana/cost-center/cost-center.module'
import { HanaBranchModule } from '../../../core/b1/hana/branch/branch.module'
import { HanaProjectModule } from '../../../core/b1/hana/project/project.module'
import { LoginModule } from '../../../core/b1/service-layer/login/login.module';
import { LogsModule } from '../../../core/logs/logs.module';

@Module({
	imports: [LoginModule, JournalEntriesRequestsModule, HanaCostCenterModule, HanaProjectModule, HanaBranchModule, LogsModule],
	providers: [MatrixDistribuitionService],
	controllers: [MatrixDistribuitionController]
})
export class MatrixDistribuitionModule { }
