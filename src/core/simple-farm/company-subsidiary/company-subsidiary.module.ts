import { Module } from '@nestjs/common';
import { SimpleFarmCompanySubsidiaryService } from './company-subsidiary.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmCompanySubsidiaryService],
	exports: [SimpleFarmCompanySubsidiaryService]
})

export class SimpleFarmCompanySubsidiaryModule { }
