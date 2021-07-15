import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoginModule } from './core/b1/service-layer/login/login.module';
import { BatchRequestModule } from './core/b1/service-layer/batch-request/batch-request.module';
import { AuthenticationModule } from './api/authentication/login/authentication.module';
import { StockMovementModule } from './api/stock/movement/stock-movement.module';
import { PurchaseRequestModule } from './api/purchase/request/purchase-request.module';
import { StockTransferRequestModule } from './api/stock/transfer-request/stock-transfer-request.module';
import { MatrixDistribuitionModule } from './api/cost/matrix-distribution/matrix-distribution.module';
import { HarvestReportModule } from './api/cost/harvest-report/harvest-report.module';
import { CompanyModule } from './service/company/company.module';
import { MonitorModule } from './api/monitor/monitor.module';
import { PurchaseOrdersModule } from './api/purchase/orders/purchase-orders.module';
import { DownPaymentsModule } from './api/sale/down-payment/down-payment.module';
import { SaleOrdersModule } from './api/sale/orders/sale-orders.module';
import { InvoiceModule } from './api/sale/invoice/invoice.module';
import { AdditionalInvoiceModule } from './api/sale/additional-invoice/additional-invoice.module';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
		LoginModule,
		BatchRequestModule,
		AuthenticationModule,		
		MatrixDistribuitionModule,
		HarvestReportModule,
		StockMovementModule,
		AuthenticationModule,
		StockMovementModule,
		PurchaseRequestModule,
		StockTransferRequestModule,
		HarvestReportModule,
		MatrixDistribuitionModule,
		AuthenticationModule,
		MonitorModule,
		CompanyModule,
		PurchaseOrdersModule,
		SaleOrdersModule,
		DownPaymentsModule,
		InvoiceModule,
		AdditionalInvoiceModule
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
