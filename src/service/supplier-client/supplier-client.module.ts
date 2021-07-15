import { Module } from '@nestjs/common';
import { SupplierClientService } from './supplier-client.service';
import { SimpleFarmSupplierClient } from '../../core/simple-farm/supplier-client/supplier-client.module';
import { HanaBusinessPartnersModule } from '../../core/b1/hana/business-partners/business-partners.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [SimpleFarmSupplierClient, HanaBusinessPartnersModule, LogsModule],
	controllers: [],
	providers: [SupplierClientService],
	exports: [SupplierClientService],
})
export class SupplierClientModule { }
