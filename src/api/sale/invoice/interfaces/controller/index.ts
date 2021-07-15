import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';
import { Exception } from '../../../../../core/exception';

export class InvoiceItemRequest {

  @ApiProperty({description: 'Código do Item'})
  itemCode: string;

  @ApiProperty({description: 'Preço Unitário do Item'})
  unitPrice: number;

  @ApiProperty({description: 'Quantidade do Item'})
  quantity: number;

  @ApiProperty({description: 'Código do Depósito de retirada do item'})
  warehouseCode: string;

  @ApiProperty({description: 'Código de Utilização'})
  usage: string;
}

export class InvoiceRequest {

  @ApiProperty({description: 'Id da Ordem'})
  orderId: string;

  @ApiProperty({ format: 'YYYY-MM-DD', description: 'Data de Vencimento' })
  dueDate?: string;

  @ApiProperty({ format: 'YYYY-MM-DD', description: 'Data do Documento' })
  documentDate: string;

  @ApiProperty({description: 'Número do Romaneio'})
  invoiceNumber: string;

  @ApiProperty({description: 'Data de vencimento da nf'})
  DtVncNF: string;

  @ApiProperty({description: 'Peso Líquido'})
  netWeight: number;

  @ApiProperty({description: 'Peso Total'})
  grossWeight: number;
  
  @ApiProperty({description: 'Placa do veículo'})
  vehicle: string;

  @ApiProperty({description: 'Estado do veículo'})
  vidState: string;

  @ApiProperty({description: 'Código da transportadora'})
  carrier: number;  
  
  @ApiProperty({description: 'Observações'})
  comments: string;

  @ApiProperty({description: 'Tipo de frete'})
  freightType: number;

  @ApiProperty({ isArray: true, type: InvoiceItemRequest, description: 'Romaneio' })
  items: InvoiceItemRequest[]

}



export class InvoiceData {

  @ApiProperty({description: 'Id do Romaneio'})
  invoiceId?: string;

  @ApiProperty({description: 'Número do Romaneio'})
  invoiceNum?: string;

  @ApiProperty({description: 'Seq do Romaneio'})
  invoiceSeq?: string;

}

export class InvoiceResult implements HttpServiceResponse<InvoiceData> {

  @ApiProperty({description: 'Dados do Romaneio'})
  data?: InvoiceData;

  @ApiProperty()
  error?: Exception;

}


