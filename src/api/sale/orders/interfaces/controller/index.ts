import { ApiProperty } from '@nestjs/swagger';
import { Deserializer } from 'v8';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';
import { Exception } from '../../../../../core/exception';

export enum Descricao {
	Codigo_do_lugar_de_negocios = "Codigo do Local de Negócios",
	referencia = "Referência",
	Codigo_do_projeto= "Código do Projeto",
	Numero_do_Contrato="Número do Contrato",
	Data_do_Documento= "Data do Documento",
	Documento_data= "DueDocument",
	Codigo_do_Parceiro= "Código do Parceiro",
	remarks= "Observação",
	Codigo_do_item= "Código do Item",
	Unidade_de_medida= "Unidade de Medida",
	Quantidade= "Quantidade",
	Preço= "Preço",
	Codigo_do_armazem= "Codigo do Armazêm",
	Codigo_da_Central_de_Custos= "Codigo da Central de Custos",
	Id_da_ordem= "Id da ordem",
	Data_de_= "Data de",
	Preço_Unitario= "Preço Unitário",
	Numero_da_fatura= "Número da Fatura",
	DtVncNF= "?",
	Peso_liquido= "Peso líquido",
	Peso_total= "Peso Total" ,
	Veiculo= "Veículo",
	VidState= "?",
	Operadora= "Operadora",
	Comentarios= "Comentários",
	Tipo_de_frete= "Tipo de frete"

}

export class SalesOrdersItemRequest {
  @ApiProperty({description: 'Código do Item'})
  itemCode: string;

  @ApiProperty({description: 'Unidade de medida'})
  measureUnit: string;

  measureUnitId: string;

  @ApiProperty({description: 'Quantidade do Item'})
  quantity: number;

  @ApiProperty({description: 'Preço'})
  price: number;

  @ApiProperty({description: 'Código do Depósito de retirada do item'})
  warehouseCode: string;

  @ApiProperty({ required: false, description: 'Código do Centro de custos' })
  costCenterCode?: string;
}

export class SaleOrdersRequest {

  @ApiProperty({description:'Código do Endereço do negócio'})
  businessPlaceCode: number;

  @ApiProperty({ required: false, description: 'Referência' })
  reference?: string;

  @ApiProperty({description: 'Código do Projeto'})
  projectCode: string;

  @ApiProperty({description: 'Número do Contrato'})
  contractNumber: string;

  @ApiProperty({ format: 'YYYY-MM-DD', description: 'Data do Documento' })
  documentDate: string;

  @ApiProperty({ format: 'YYYY-MM-DD', description: 'Data de Vencimento do Documento'})
  documentDueDate?: string;

  @ApiProperty({description: 'Código de Parceiro'})
  partnerCode: string;
  
  @ApiProperty({ required: false, description: 'Observações' })
  remarks?: string;

  @ApiProperty({ isArray: true, type: SalesOrdersItemRequest })
  items: SalesOrdersItemRequest[]

}



export class SaleOrdersData {

  @ApiProperty({description: 'Id da Ordem'})
  orderId?: string;

  @ApiProperty({description: 'Número da Ordem'})
  orderNum?: string;

}

export class SaleOrdersResult implements HttpServiceResponse<SaleOrdersData> {

  @ApiProperty({description: 'Dados de ordens de venda' })
  data?: SaleOrdersData;

  @ApiProperty()
  error?: Exception;

}


