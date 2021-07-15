import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { SimpleFarmCompanyModule } from '../../core/simple-farm/company/company.module';
import { HanaCompanyModule } from '../../core/b1/hana/company/company.module';
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [SimpleFarmCompanyModule, HanaCompanyModule, LogsModule],
	providers: [CompanyService],
	exports: [CompanyService],
})
export class CompanyModule { }
