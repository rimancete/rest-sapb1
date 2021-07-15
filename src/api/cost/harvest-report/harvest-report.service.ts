import { Injectable } from '@nestjs/common';
import { LoginService } from '../../../core/b1/service-layer/login/login.service';
import { HttpServiceResponse } from '../../../core/b1/service-layer/http/interfaces';
import { HarvestReportResult, HarvestReportRequest } from './interfaces/controller';
import { JournalEntriesRequestsService } from '../../../core/b1/service-layer/journal-entries/journal-requests.service';
import { MaterialRevaluationRequestsService } from '../../../core/b1/service-layer/material-revaluation/material-revaluation.service';
import { HanaCostCenterService } from '../../../core/b1/hana/cost-center/cost-center.service';
import { HanaBranchService } from '../../../core/b1/hana/branch/branch.service';
import { HanaProjectService } from '../../../core/b1/hana/project/project.service';
import { HanaMaterialRevaluationService } from '../../../core/b1/hana/material-revaluation/material-revaluation.service'
import { HanaLogService } from '../../../core/b1/hana/log/log.service'
import { JournalEntryDocument, JournalEntryDocumentLines } from "../../../core/b1/service-layer/journal-entries/interfaces";
import { LogsService } from '../../../core/logs/logs.service';
import { Mapper } from './interfaces/service';
import * as _ from 'lodash';
import { Exception } from '../../../core/exception';
import { HanaItemService } from '../../../core/b1/hana/item/item.service';
import { LogModule } from '../../../core/logs/interface';
import * as moment from 'moment';
import { Lines, MaterialRevaluation } from 'src/core/b1/service-layer/material-revaluation/interfaces';

@Injectable()
export class HarvestReportService {
  constructor(private readonly journalEntriesRequestsService: JournalEntriesRequestsService,
    private readonly hanaItemService: HanaItemService,
    private readonly hanaProjectService: HanaProjectService,
    private readonly hanaBranchService: HanaBranchService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly materialRevaluationRequestsService: MaterialRevaluationRequestsService,
    private readonly logsService: LogsService) {

  }

  async insertRequest(token: string, request: HarvestReportRequest): Promise<HarvestReportResult> {

    try {

      await this.validate(request);

      const revaluation = await this.resolve(request);

      const result = await this.materialRevaluationRequestsService.session(token).create(revaluation);

      return {
        error: result.error,
        data: result.data && Mapper.To(result.data)
      };

    }
    catch (exception) {
      this.logsService.logError({ key: request.referenceDate, module: LogModule.HARVEST, exception: { ...exception, request: request } });
      return { data: null, error: { ...exception } };
    }

  }

  async validate(request: HarvestReportRequest): Promise<void> {

    const branch = await this.hanaBranchService.getBPLId(request.businessPlaceCode.toString());
    if (!branch) {
      throw new Exception({ code: 'X001', message: `Filial [${request.businessPlaceCode}] não encontrada.`, request, response: null });
    }

    const project = await this.hanaProjectService.getProject(request.projectCode);
    if (!project) {
      throw new Exception({ code: 'X004', message: `Projeto [${request.projectCode}] não encontrado.`, request, response: null });
    }

    const item = await this.hanaItemService.getItem(request.itemCode);
    if (!item) {
      throw new Exception({ code: 'X002', message: `Item [${request.itemCode}] não encontrado.`, request, response: null });
    } else {
      request.itemAppropriationAccount = item.U_ALFA_ContaApropriacao;
      request.itemAppropriationCostCenter = item.U_ALFA_CCApropriacao;
    }

    const costCenters = await this.hanaItemService.getItemCostCenters(request.itemCode);
    if (costCenters.length === 0) {
      throw new Exception({ code: 'X003', message: `Item [${request.itemCode}] não possui centros de custos associado.`, request, response: null });
    } else {
      request.itemCostCenters = costCenters.map(r => r["Code"]);
    }

  }

  round(num: number): number {
    return Math.round((num - 0.00001) * 100) / 100;
  }

  async resolve(request: HarvestReportRequest): Promise<MaterialRevaluation> {

    // const start = moment(request.referenceDate).set('date', 1).format('YYYY-MM-DD');
     const end = moment(request.referenceDate).add(1, 'month').add(-1, 'day').format('YYYY-MM-DD');

    const valueDate = await this.hanaCostCenterService.getRefDateConfigCost();

    if (valueDate.length <= 0){
      throw new Exception({ code: 'X101', message: 'Data de referência não foi encontrado na tabela de configuração', request, response: null });
    }

    const production = await this.hanaCostCenterService.getProductionSummary(request.itemCode, request.projectCode, request.businessPlaceCode, request.referenceDate);
    const summary = await this.hanaCostCenterService.getCostSummaryHarvest(request.itemCostCenters, request.projectCode, request.businessPlaceCode, valueDate.STARTDATE, valueDate.ENDDATE);

    let revaluation: MaterialRevaluation = {}

    if (production.length > 0) {

      if (summary.length > 0) {

        const percent = request.harvest / request.plantation;

        revaluation = {
          Comments: 'MAC - Apropriação de custo ' + request.itemCode,
          JournalMemo: 'MAC - Apropriação de custo ' + request.itemCode,
          DocDate: end,
          TaxDate: end,
          RevalType: 'M',
          MaterialRevaluationLines: [{
            DebitCredit: this.round(Math.abs(_.first(summary).Balance) * percent),
            ItemCode: request.itemCode,
            Project: request.projectCode,
            Quantity: _.first(production).Quantity,
            WarehouseCode: _.first(production).WhsCode,
            RevaluationDecrementAccount: _.first(summary).Account,
            RevaluationIncrementAccount: _.first(summary).Account,
          }]
        }

        return revaluation;

      } else {
        throw new Exception({ code: 'X005', message: `Não existem custos para o produto, período, filial e projeto informado.`, request, response: null });
      }

    } else {
      throw new Exception({ code: 'X005', message: `Não existem entrada na balança para o produto, período, filial e projeto informado.`, request, response: null });
    }


  }

}
