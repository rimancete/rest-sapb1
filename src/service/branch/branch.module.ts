import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { SimpleFarmCompanySubsidiaryModule } from '../../core/simple-farm/company-subsidiary/company-subsidiary.module';
import { HanaBranchModule } from '../../core/b1/hana/branch/branch.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [SimpleFarmCompanySubsidiaryModule, HanaBranchModule, LogsModule],
	providers: [BranchService],
	exports: [BranchService],
})
export class BranchModule { }
