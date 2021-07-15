import { Injectable } from '@nestjs/common';
import { LogsResult, LogsData } from './interfaces/controller';
import { HanaLogService } from '../../core/b1/hana/log/log.service';
import { HanaCompanyService } from '../../core/b1/hana/company/company.service';
import { HanaBranchService } from '../../core/b1/hana/branch/branch.service';
import { HanaCityService } from '../../core/b1/hana/city/city.service';
import { HanaBusinessPartnersService } from '../../core/b1/hana/business-partners/business-partners.service';
import { HanaCostCenterService } from '../../core/b1/hana/cost-center/cost-center.service';
import { HanaCountryService } from '../../core/b1/hana/country/country.service';
import { HanaCurrencyService } from '../../core/b1/hana/currency/currency.service';
import { HanaCurrencyCategoryService } from '../../core/b1/hana/currency-category/currency-category.service';
import { HanaCurrencyQuoteService } from '../../core/b1/hana/currency-quote/currency-quote.service';
import { HanaInventoryLocationService } from '../../core/b1/hana/inventory-location/inventory-location.service';
import { HanaItemService } from '../../core/b1/hana/item/item.service';
import { HanaItemFamilyService } from '../../core/b1/hana/item-family/item-family.service';
import { HanaItemGroupService } from '../../core/b1/hana/item-group/item-group.service';
import { HanaItemInventoryService } from '../../core/b1/hana/item-inventory/item-inventory.service';
import { HanaItemPriceService } from '../../core/b1/hana/item-price/item-price.service';
import { HanaMaterialRevaluationService } from '../../core/b1/hana/material-revaluation/material-revaluation.service';
import { HanaProjectService } from '../../core/b1/hana/project/project.service';
import { HanaStateService } from '../../core/b1/hana/state/state.service';
import { HanaUnitMeasurementService } from '../../core/b1/hana/unit-measurement/unit-measurement.service';
import { Log } from '../../core/b1/hana/log/intefaces';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { HanaBatchService } from 'src/core/b1/hana/batch/batch.service';
import { HanaContractService } from 'src/core/b1/hana/contract/contract.service';
import { HanaTransactionModule } from 'src/core/b1/hana/transaction/transaction.module';
import { HanaTransactionService } from 'src/core/b1/hana/transaction/transaction.service';
import { HanaPaymentConditionService } from 'src/core/b1/hana/payment-condition/payment-condition';

@Injectable()
export class MonitorService {
  constructor(private readonly hanaLogService: HanaLogService,
    private readonly hanaCompanyService: HanaCompanyService,
    private readonly hanaBranchService: HanaBranchService,
    private readonly hanaCityService: HanaCityService,
    private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly hanaCountryService: HanaCountryService,
    private readonly hanaCurrencyService: HanaCurrencyService,
    private readonly hanaCurrencyCategoryService: HanaCurrencyCategoryService,
    private readonly hanaCurrencyQuoteService: HanaCurrencyQuoteService,
    private readonly hanaInventoryLocationService: HanaInventoryLocationService,
    private readonly hanaItemService: HanaItemService,
    private readonly hanaItemFamilyService: HanaItemFamilyService,
    private readonly hanaItemGroupService: HanaItemGroupService,
    private readonly hanaItemInventoryService: HanaItemInventoryService,
    private readonly hanaItemPriceService: HanaItemPriceService,
    private readonly hanaMaterialRevaluationService: HanaMaterialRevaluationService,
    private readonly hanaProjectService: HanaProjectService,
    private readonly hanaBatchService: HanaBatchService,
    private readonly hanaStateService: HanaStateService,
    private readonly hanaContractService: HanaContractService,
    private readonly hanaUnitMeasurementService: HanaUnitMeasurementService,
    private readonly hanaTransactionService: HanaTransactionService,
    private readonly hanaPaymentConditionService: HanaPaymentConditionService
  ) { }

  async getLogs(): Promise<LogsResult> {

    let response: LogsResult = {}

    const result = await this.hanaLogService.getLogs();

    response = {
      error: result.error,
      data: result.data
    }

    return response;
  }


  async getOverviewLogs(): Promise<any> {

    let response: any = {}

    const resultBatch = await this.hanaBatchService.getIntegrationValues();

    const resultCompany = await this.hanaCompanyService.getIntegrationValues();

    const resultContract = await this.hanaContractService.getIntegrationValues();

    const resultBranch = await this.hanaBranchService.getIntegrationValues();

    const resultBusinessParter = await this.hanaBusinessPartnersService.getIntegrationValues();

    const resultCity = await this.hanaCityService.getIntegrationValues();

    const resultCostCenter = await this.hanaCostCenterService.getIntegrationValues();

    const resultCountry = await this.hanaCountryService.getIntegrationValues();

    const resultCurrency = await this.hanaCurrencyService.getIntegrationValues();

    const resultCurrencyCategory = await this.hanaCurrencyCategoryService.getIntegrationValues();

    const resultCurrencyQuote = await this.hanaCurrencyQuoteService.getIntegrationValues();

    const resultInventoryLocation = await this.hanaInventoryLocationService.getIntegrationValues();

    const resultItens = await this.hanaItemService.getIntegrationValues();


    const resultItemFamily = await this.hanaItemFamilyService.getIntegrationValues();

    const resultItemGroup = await this.hanaItemGroupService.getIntegrationValues();

    const resultItemInventory = await this.hanaItemInventoryService.getIntegrationValues();

    const resultItemPrice = await this.hanaItemPriceService.getIntegrationValues();

    const resultState = await this.hanaStateService.getIntegrationValues();

    const resultUnitMeasure = await this.hanaUnitMeasurementService.getIntegrationValues();

    const resultTransaction = await this.hanaTransactionService.getIntegrationValues();

    const resultPaymentCondition = await this.hanaPaymentConditionService.getIntegrationValues();

    const result = [
      { module: LogModule.PAYMENT_CONDITION, overview: _.first(resultPaymentCondition.data)},
      { module: LogModule.TRANSACTION, overview: _.first(resultTransaction.data)},
      { module: LogModule.BATCH, overview: _.first(resultBatch.data) },
      { module: LogModule.COMPANY, overview: _.first(resultCompany.data) },
      { module: LogModule.CONTRACT, overview: _.first(resultContract.data) },
      { module: LogModule.BRANCH, overview: _.first(resultBranch.data) },
      { module: LogModule.COUNTRY, overview: _.first(resultCountry.data) },
      { module: LogModule.STATE, overview: _.first(resultState.data) },
      { module: LogModule.CITY, overview: _.first(resultCity.data) },
      { module: LogModule.CURRENCY_CATEGORY, overview: _.first(resultCurrencyCategory.data) },
      { module: LogModule.CURRENCY, overview: _.first(resultCurrency.data) },
      { module: LogModule.CURRENCY_QUOTE, overview: _.first(resultCurrencyQuote.data) },
      { module: LogModule.COST_CENTER, overview: _.first(resultCostCenter.data) },
      { module: LogModule.UNIT_MEASUREMENT, overview: _.first(resultUnitMeasure.data) },
      { module: LogModule.INVENTORY_LOCATION, overview: _.first(resultInventoryLocation.data) },
      { module: LogModule.ITEM_GROUP, overview: _.first(resultItemGroup.data) },
      { module: LogModule.ITEM_FAMILY, overview: _.first(resultItemFamily.data) },
      { module: LogModule.SUPLIER_CLIENT, overview: _.first(resultBusinessParter.data) },
      { module: LogModule.ITEM, overview: _.first(resultItens.data) },
      { module: LogModule.ITEM_INVENTORY, overview: _.first(resultItemInventory.data) },
      { module: LogModule.ITEM_PRICE, overview: _.first(resultItemPrice.data) }
    ];

    response = {
      data: result
    }

    return response;
  }

  async getLogDetails(request: LogsData): Promise<LogsResult> {

    let response: LogsResult = {}

    const entity: Log = {
      Code: request.Code
    };

    const result = await this.hanaLogService.getLogDetails(entity);

    response = {
      error: result.error,
      data: result.data
    }

    return response;

  }


  async getApiOverviewLogs(): Promise<any> {
    let response: any = {}

    const result = await this.hanaLogService.getApiOverview();

    response = {
      error: result.error,
      data: result.data
    }

    return response;

  }

  async getApiGraph(): Promise<any> {
    let response: any = {}

    const result = await this.hanaLogService.getApiGraph();

    response = {
      error: result.error,
      data: result.data
    }

    return response;

  }

}
