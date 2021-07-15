export interface SupplierClient{
   Code?: string,
   Name?: string,
   Email?: string,
   Phone?: string,
   Type?: number,
   PeopleType?:  number,
   Street?:string,
   CityCode?: string,
   Zipcode?: string,
   Postcode?: string,
   PlaceNumber?: string,
   AddressObs?: string,
   Neighborhood?: string,
   Active?:  boolean,
   Cnpj?: string,
   AdditionalTypes?: AdditionalTypes[]
   Addresses?: SupplierClientAddresses[]
}

export interface SupplierClientAddresses{
   Code?: string,
   Street?: string,
   CityCode?: string,
   Cnpj?: string
}

export enum AdditionalTypes {
   cliente = 1,
   fornecedor = 2,
   consignatário = 3,
   proprietárioDeEquipamentosPróprio = 4,
   despachante = 5,
   corretora = 6,
   transportadora = 7,
   notificador = 8,
   associaçãoDeFornecedores = 9,
   proprietárioDeEquipamentosTerceiro = 10
   
 }