import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { HanaLogModule } from '../../core/b1/hana/log/log.module';
import { HanaCompanyModule } from '../../core/b1/hana/company/company.module';
import { HanaBranchModule } from '../../core/b1/hana/branch/branch.module';
import { HanaCityModule } from '../../core/b1/hana/city/city.module';
import { HanaBusinessPartnersModule } from '../../core/b1/hana/business-partners/business-partners.module';
import { HanaCostCenterModule } from '../../core/b1/hana/cost-center/cost-center.module';
import { HanaCountryModule } from '../../core/b1/hana/country/country.module';
import { HanaCurrencyModule } from '../../core/b1/hana/currency/currency.module';
import { HanaCurrencyCategoryModule } from '../../core/b1/hana/currency-category/currency-category.module';
import { HanaCurrencyQuoteModule } from '../../core/b1/hana/currency-quote/currency-quote.module';
import { HanaInventoryLocationModule } from '../../core/b1/hana/inventory-location/inventory-location.module';
import { HanaItemModule } from '../../core/b1/hana/item/item.module';
import { HanaItemFamilyModule } from '../../core/b1/hana/item-family/item-family.module';
import { HanaItemGroupModule } from '../../core/b1/hana/item-group/item-group.module';
import { HanaItemInventoryModule } from '../../core/b1/hana/item-inventory/item-inventory.module';
import { HanaItemPriceModule } from '../../core/b1/hana/item-price/item-price.module';
import { HanaMaterialRevoluationModule } from '../../core/b1/hana/material-revaluation/material-revaluation.module';
import { HanaProjectModule } from '../../core/b1/hana/project/project.module';
import { HanaStateModule } from '../../core/b1/hana/state/state.module';
import { HanaUnitMeasurementModule } from '../../core/b1/hana/unit-measurement/unit-measurement.module';
import { HanaBatchModule } from 'src/core/b1/hana/batch/batch.module';
import { HanaContractModule } from 'src/core/b1/hana/contract/contract.module';
import { HanaTransactionModule } from 'src/core/b1/hana/transaction/transaction.module';
import { HanaPaymentConditionModule } from 'src/core/b1/hana/payment-condition/payment-condition.module';

@Module({
	imports: [HanaLogModule, 
		HanaCompanyModule, 
		HanaBranchModule,
		HanaCityModule,
		HanaBusinessPartnersModule,
		HanaCostCenterModule,
		HanaCountryModule,
		HanaCurrencyModule,
		HanaCurrencyCategoryModule,
		HanaCurrencyQuoteModule,
		HanaInventoryLocationModule,
		HanaItemModule,
		HanaItemFamilyModule,
		HanaItemGroupModule,
		HanaItemInventoryModule,
		HanaItemPriceModule,
		HanaMaterialRevoluationModule,
		HanaStateModule,
		HanaUnitMeasurementModule,
    HanaProjectModule,
    HanaBatchModule,
    HanaContractModule,
    HanaTransactionModule,
    HanaPaymentConditionModule
	],
	providers: [MonitorService],
	controllers: [MonitorController]
})
export class MonitorModule { }
