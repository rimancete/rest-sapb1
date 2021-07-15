import * as _ from 'lodash';

export interface MaterialRevaluation {
  DocEntry?: string,
  Comments?: string,
  JournalMemo?: string,
  DocDate?: string,
  MaterialRevaluationLines?: Lines[],
  RevalType?: string,
  TaxDate?: string
}

export interface Lines {
  ItemCode: string;
  Quantity: number;
  WarehouseCode:  string;
  DebitCredit: number;
  RevaluationDecrementAccount:  string;
  RevaluationIncrementAccount:  string;
  Project: string;
}

/*
{
  "DocNum": 11,
  "DocDate": "2021-01-31",
  "Reference1": "11",
  "Reference2": null,
  "Comments": null,
  "JournalMemo": "Reavaliação do estoque",
  "Series": 25,
  "TaxDate": "2021-01-31",
  "RevalType": "M",
  "MaterialRevaluationLines": [
      {
          "LineNum": 0,
          "ItemCode": "002474",
          "ItemDescription": "SOJA GRAO GRANEL",
          "Quantity": 1.0,
          "Price": 0.0,
          "WarehouseCode": "0610",
          "ActualPrice": 0.0,
          "OnHand": 0.0,
          "DebitCredit": 1000.0,
          "DocEntry": 141,
          "RevaluationDecrementAccount": "1.01.02.02.99",
          "RevaluationIncrementAccount": "1.01.02.02.99",
          "RevalAmountToStock": 0.0,
          "Project": "19/20-SAF2",
          "DistributionRule": "",
          "DistributionRule2": "",
          "DistributionRule3": "",
          "DistributionRule4": "",
          "DistributionRule5": "",
          "FIFOLayers": [],
          "SNBLinesCollection": []
      }
  ]
}*/