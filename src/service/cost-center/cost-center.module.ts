import { Module } from '@nestjs/common';
import { CostCenterService } from './cost-center.service';
import { SimpleFarmCostCenterModule } from '../../core/simple-farm/cost-center/cost-center.module';
import { HanaCostCenterModule } from '../../core/b1/hana/cost-center/cost-center.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [SimpleFarmCostCenterModule, HanaCostCenterModule, LogsModule],
	providers: [CostCenterService],
	exports: [CostCenterService],
})
export class CostCenterModule { }
