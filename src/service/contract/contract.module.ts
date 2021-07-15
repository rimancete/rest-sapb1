import { Module } from '@nestjs/common';
import { SimpleFarmCityModule } from '../../core/simple-farm/city/city.module';
import { HanaCityModule } from '../../core/b1/hana/city/city.module'
import { LogsModule } from '../../core/logs/logs.module';
import { ContractService } from './contract.service';
import { HanaContractModule } from 'src/core/b1/hana/contract/contract.module';
import { SimpleFarmContractModule } from 'src/core/simple-farm/contract/contract.module';

@Module({
	imports: [HanaContractModule, SimpleFarmContractModule, LogsModule],
	providers: [ContractService],
	exports: [ContractService],
})
export class ContractModule { }
