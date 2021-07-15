import { Injectable } from '@nestjs/common';
import { MatrixDistribuitionRequest, MatrixDistribuitionResult } from './interfaces/controller';
import { JournalEntriesRequestsService } from '../../../core/b1/service-layer/journal-entries/journal-requests.service';
import { HanaCostCenterService } from '../../../core/b1/hana/cost-center/cost-center.service';
import { JournalEntryDocument, JournalEntryDocumentLines } from "../../../core/b1/service-layer/journal-entries/interfaces";
import { HanaProjectService } from '../../../core/b1/hana/project/project.service';
import { HanaBranchService } from '../../../core/b1/hana/branch/branch.service';
import { CostCenterSummary } from '../../../core/b1/hana/cost-center/interfaces';
import { LogsService } from '../../../core/logs/logs.service';
import { LogModule } from '../../../core/logs/interface';
import { Exception } from '../../../core/exception';
import { Mapper } from './interfaces/service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class MatrixDistribuitionService {
  constructor(private readonly journalEntriesRequestsService: JournalEntriesRequestsService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly hanaProjectService: HanaProjectService,
    private readonly hanaBranchService: HanaBranchService,
    private readonly logsService: LogsService) {

  }

  async insertRequest(token: string, request: MatrixDistribuitionRequest): Promise<MatrixDistribuitionResult> {
    try {

      await this.validate(request);

      const journal = await this.resolve(request);

      const result = await this.journalEntriesRequestsService.session(token).create(journal);

      return {
        error: result.error,
        data: result.data && Mapper.To(result.data)
      };


    }
    catch (exception) {
      this.logsService.logError({ key: request.referenceDate, module: LogModule.MATRIX_DISTRIBUITION, exception: { ...exception, request: request } });
      return { data: null, error: { ...exception } };
    }
  }


  async validate(request: MatrixDistribuitionRequest): Promise<void> {

    const branch = await this.hanaBranchService.getBPLId(request.businessPlaceCode.toString());
    if (!branch) {
      throw new Exception({ code: 'X001', message: `Filial [${request.businessPlaceCode}] não encontrada.`, request, response: null });
    }

    if (request.projectCode) {
      const project = await this.hanaProjectService.getProject(request.projectCode);
      if (!project) {
        throw new Exception({ code: 'X004', message: `Projeto [${request.projectCode}] não encontrado.`, request, response: null });
      }
    }

    const costCenter = await this.hanaCostCenterService.getCostCenter(request.costCenterCode);
    if (!costCenter) {
      throw new Exception({ code: 'X002', message: `Centro de custo [${request.costCenterCode}] origem não encontrado.`, request, response: null });
    } else {
      request.costCenterType = costCenter.U_Tipo;
    }

    for (const line of request.distribution) {
      const lineCostCenter = await this.hanaCostCenterService.getCostCenter(line.costCenterCode);
      if (!lineCostCenter) {
        throw new Exception({ code: 'X003', message: `Centro de custo [${line.costCenterCode}] destino não encontrado.`, request, response: null });
      } else {
        line.costCenterType = lineCostCenter.U_Tipo;
      }
    }

  }

  round(num: number): number {
    return Math.round((num - 0.00001) * 100) / 100;
  }

  async resolve(request: MatrixDistribuitionRequest): Promise<JournalEntryDocument> {

    const start = moment(request.referenceDate).set('date', 1).format('YYYY-MM-DD');
    const end = moment(request.referenceDate).add(1, 'month').add(-1, 'day').format('YYYY-MM-DD');

    let summary: CostCenterSummary[] = await this.hanaCostCenterService.getCostSummary(request.costCenterCode, request.projectCode, request.businessPlaceCode, start, end);

    if (summary && summary.length > 0) {

      const journal: JournalEntryDocument = {
        ReferenceDate: end,
        ProjectCode: request.projectCode,
        Reference: 'MAC',
        Memo: `MAC - Absorção CC ${request.costCenterCode}`,
        JournalEntryLines: []
      }

      let fromLines: JournalEntryDocumentLines[] = [];
      let toLines: JournalEntryDocumentLines[] = [];

      for (const accountSummary of summary) {

        let summaryTotal = accountSummary.Balance;
        let linesTotal = 0;

        if (Math.abs(accountSummary.Balance) > 0) {

          const summaryFromLines: JournalEntryDocumentLines[] = [];
          const summaryToLines: JournalEntryDocumentLines[] = [];

          let greaterValue = 0;
          let greaterValueIndex = 0;

          for (const [index, costCenter] of request.distribution.entries()) {

            let value = this.round(accountSummary.Balance * (costCenter.percentage / 100));
            
            if (value > greaterValue) {
              greaterValue = value;
              greaterValueIndex = index;
            }

            linesTotal += value;

            const fromLine: JournalEntryDocumentLines = {
              AccountCode: accountSummary.Account,
              Credit: accountSummary.Balance > 0 ? Math.abs(value) : 0,
              Debit: accountSummary.Balance < 0 ? Math.abs(value) : 0,
              BPLID: request.businessPlaceCode.toString(),
              CostingCode: request.costCenterCode,
              ProjectCode: request.projectCode,
              DueDate: end
            };

            const toLine: JournalEntryDocumentLines = {
              AccountCode: costCenter.costCenterType == 'I' ? accountSummary.InvAccount : accountSummary.CostAccount,
              Credit: accountSummary.Balance < 0 ? Math.abs(value) : 0,
              Debit: accountSummary.Balance > 0 ? Math.abs(value) : 0,
              BPLID: request.businessPlaceCode.toString(),
              CostingCode: costCenter.costCenterCode,
              ProjectCode: request.projectCode,
              DueDate: end
            };

            summaryFromLines.push(fromLine);
            summaryToLines.push(toLine);

            //Ultima linha inclui a diferença de arrendondamento na origem/destino com maior valor dentro do CC
            if (index == request.distribution.length - 1) {

              const balance = Math.abs(this.round(this.round(summaryTotal) - this.round(linesTotal)))
              if (balance != 0) {
                const greaterFromLine = summaryFromLines[greaterValueIndex];
                const greaterToLine = summaryToLines[greaterValueIndex];

                greaterFromLine.Credit += greaterFromLine.Credit > 0 ? balance : 0;
                greaterFromLine.Debit += greaterFromLine.Debit > 0 ? balance : 0;

                greaterToLine.Credit += greaterToLine.Credit > 0 ? balance : 0;
                greaterToLine.Debit += greaterToLine.Debit > 0 ? balance : 0;
              }
            }

          }

          fromLines = fromLines.concat(...summaryFromLines);
          toLines = toLines.concat(...summaryToLines);
        }
      }

      for (const line of fromLines) {
        journal.JournalEntryLines.push(line);
      }

      for (const line of toLines) {
        journal.JournalEntryLines.push(line);
      }

      if (journal.JournalEntryLines.length == 0) {
        throw new Exception({ code: 'X005', message: `Não existe saldo em contas para o centro de custo e projeto origem.`, request, response: null });
      }

      return journal;

    } else {
      throw new Exception({ code: 'X005', message: `Não existem lançamentos para o centro de custo e projeto origem.`, request, response: null });
    }

  }

}
