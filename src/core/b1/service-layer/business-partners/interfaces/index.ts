import * as _ from 'lodash';

export interface BusinessPartner {
  Action?: string,
  CardCode?: string,
  CardName?: string,
  CardType?: string,
  CardForeignName?: string,
  GroupCode?: string,
  Phone1?: string,
  Phone2?: string,
  Cellular?: string,
  Fax?: string,
  EmailAddress?: string,
  MailAddress?: string,
  Password?: string,
  PayTermsGrpCode?: string,
  BankCountry?: string,
  HouseBank?: string,
  HouseBankCountry?: string,
  HouseBankAccount?: string,
  DebitorAccount?: string,
  FreeText?: string,
  BilltoDefault?: string,
  U_ALFA_Id?: string,
  U_ALFA_LastUpdate?: string,
  BPAddresses?: Partial<BPAddress>[],
  BPFiscalTaxIDCollection?: Partial<BPFiscalTaxID>[],
  BPBankAccounts?: Partial<BPBankAccount>[],
  ContactEmployees?: Partial<ContactEmployee>[]
}

export interface BPFiscalTaxID {
  BPCode?: string,
  CNAECode?: string,
  Address?: string,
  TaxId0?: string,
  TaxId1?: string,
  TaxId2?: string,
  TaxId3?: string,
  TaxId4?: string,
  TaxId5?: string,
  TaxId6?: string,
  TaxId7?: string,
  TaxId8?: string,
  TaxId9?: string,
  TaxId10?: string,
  TaxId11?: string,
  TaxId12?: string,
  TaxId13?: string,
  AddrType: string
}


export interface BPBankAccount {
  BPCode?: string,
  Branch?: string,
  Country?: string,
  ControlKey?: string,
  BankCode?: string,
  AccountNo?: string,
  InternalKey?: string,
  AccountName?: string,
}

export interface BPAddress {
  RowNum?: string,
  AddressType?: string,
  TypeOfAddress?: string,
  AddressName?: string,
  Street?: string,
  StreetNo?: string,
  BuildingFloorRoom?: string,
  ZipCode?: string,
  Block?: string,
  City?: string,
  County?: string,
  State?: string,
  Country?: string,
  BPCode?: string
}

export interface ContactEmployee {
  InternalCode?: string,
  Name?: string,
  FirstName?: string,
  MiddleName?: string,
  LastName?: string,
  Position?: string,
  E_Mail?: string
}

// const FromList = (list: BusinessPartnerModel[]): BusinessPartner[] => {

//   let resultList: BusinessPartner[] = [];

//   let bpGroups = _.uniq(_.map(list, "CardCode"));

//   bpGroups.forEach(bpKey => {
//     let bp = _.find(list, { CardCode: bpKey });
//     let bpList = _.filter(list, { CardCode: bpKey });

//     let result: BusinessPartner = {
//       Action: bp.Action,
//       CardCode: bp.CardCode,
//       CardName: bp.CardName,
//       CardType: bp.CardType,
//       CardForeignName: bp.CardForeignName,
//       GroupCode: bp.GroupCode,
//       Phone1: bp.Phone1,
//       Phone2: bp.Phone2,
//       Cellular: bp.Cellular,
//       Fax: bp.Fax,
//       EmailAddress: bp.EmailAddress,
//       MailAddress: bp.MailAddress,
//       Password: bp.Password,
//       PayTermsGrpCode: bp.PayTermsGrpCode,
//       // BankCountry: bp.BankCountry,
//       // HouseBank: bp.HouseBank,
//       // HouseBankCountry: bp.HouseBankCountry,
//       // HouseBankAccount: bp.HouseBankAccount,
//       DebitorAccount: bp.DebitorAccount,
//       FreeText: bp.FreeText,
//       BilltoDefault: bp.BilltoDefault,
//       U_ALFA_Id: bp.U_ALFA_Id,
//       U_ALFA_LastUpdate: bp.U_ALFA_LastUpdate,
//       BPAddresses: [],
//       BPFiscalTaxIDCollection: [],
//       ContactEmployees: [],
//       BPBankAccounts: []
//     }

//     let addressGroups = _.uniq(_.map(bpList, "AddressName"));
//     addressGroups.forEach(addressKey => {
//       let address = _.find(bpList, { AddressName: addressKey });
//       result.BPAddresses.push({
//         RowNum: address.RowNum,
//         AddressType: address.AddressType,
//         TypeOfAddress: address.TypeOfAddress,
//         AddressName: address.AddressName,
//         Street: address.Street,
//         StreetNo: address.StreetNo,
//         BuildingFloorRoom: address.BuildingFloorRoom,
//         ZipCode: address.ZipCode,
//         Block: address.Block,
//         City: address.City,
//         County: address.County,
//         State: address.State,
//         Country: address.Country,
//         BPCode: address.BPCode
//       });
//     });

//     let taxGroups = _.uniq(_.map(bpList, "Address"));
//     taxGroups.forEach(taxKey => {
//       let tax = _.find(bpList, { Address: taxKey });
//       result.BPFiscalTaxIDCollection.push({
//         BPCode: tax.BPCode,
//         CNAECode: tax.CNAECode,
//         Address: tax.Address,
//         TaxId0: tax.TaxId0,
//         TaxId1: tax.TaxId1,
//         TaxId2: tax.TaxId2,
//         TaxId3: tax.TaxId3,
//         TaxId4: tax.TaxId4,
//         TaxId5: tax.TaxId5,
//         TaxId6: tax.TaxId6,
//         TaxId7: tax.TaxId7,
//         TaxId8: tax.TaxId8,
//         TaxId9: tax.TaxId9,
//         TaxId10: tax.TaxId10,
//         TaxId11: tax.TaxId11,
//         TaxId12: tax.TaxId12,
//         TaxId13: tax.TaxId13,
//         AddrType: tax.AddrType
//       });
//     });

//     let contactGroups = _.uniq(_.map(bpList, "InternalCode"));
//     contactGroups.forEach(contactKey => {
//       let contact = _.find(bpList, { InternalCode: contactKey });
//       if (contact && !_.isEmpty(contactKey)) {
//         result.ContactEmployees.push({
//           InternalCode: contact.InternalCode,
//           Name: contact.Name,
//           FirstName: contact.FirstName,
//           MiddleName: contact.MiddleName,
//           LastName: contact.LastName,
//           Position: contact.Position,
//           E_Mail: contact.E_Mail
//         });
//       }     
//     });


//     let bankAccounts = _.uniq(_.map(bpList, "InternalKey"));

//     bankAccounts.forEach(internalKey => {     

//       let bankAccount = _.find(bpList, { InternalKey: internalKey });

//       if (bankAccount && bankAccount.BankCode) {
//         result.BPBankAccounts.push({
//           //InternalKey: bankAccount.InternalKey,
//           BPCode: bankAccount.CardCode,
//           AccountName: bankAccount.AccountName,
//           AccountNo: bankAccount.AccountNo,
//           BankCode: bankAccount.BankCode,
//           Branch: bankAccount.Branch,
//           ControlKey: bankAccount.ControlKey,
//           Country: bankAccount.AcctCountry            
//         });
//       }     
//     });

//     result.BPFiscalTaxIDCollection = _.orderBy(result.BPFiscalTaxIDCollection, r => r.Address);
    
//     resultList.push(result);

//   });

//   return resultList;

// }

// export const Mapper = {
//   FromList
// }