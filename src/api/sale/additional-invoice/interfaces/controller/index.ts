import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';
import { Exception } from '../../../../../core/exception';

export class AdditionalInvoiceItemRequest {

  @ApiProperty()
  invoiceId: string;
  
}

export class AdditionalInvoiceRequest {

  @ApiProperty({ format: 'YYYY-MM-DD' })
  dueDate?: string;

  @ApiProperty({ format: 'YYYY-MM-DD' })
  documentDate: string;

  @ApiProperty()
  totalValue: number;

  @ApiProperty({ isArray: true, type: AdditionalInvoiceItemRequest })
  invoices: AdditionalInvoiceItemRequest[]

}



export class AdditionalInvoiceData {

  @ApiProperty()
  orderId?: string;

  @ApiProperty()
  orderNum?: string;

}

export class AdditionalInvoiceResult implements HttpServiceResponse<AdditionalInvoiceData> {

  @ApiProperty()
  data?: AdditionalInvoiceData;

  @ApiProperty()
  error?: Exception;

}


