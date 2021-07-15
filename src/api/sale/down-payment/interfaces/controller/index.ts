import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';

export class DownPaymentRequest {
    @ApiProperty({description: 'Id da Ordem'})
    orderId: string;
    @ApiProperty({description: 'Data de Vencimento'})
    dueDate: string;
    @ApiProperty({description: 'Data do Documento'})
    documentDate: string;
    @ApiProperty({description: 'Preço da Unidade'})
    unitPrice: string;
    @ApiProperty({description: 'Quantidade'})
    quantity: string;
}

export class DownPaymentData {

    @ApiProperty()
    DocEntry?: string;

    @ApiProperty()
    DocNum?: string;

}

export class DownPaymentsResult implements HttpServiceResponse<DownPaymentData> {

    @ApiProperty()
    data?: DownPaymentData;

    @ApiProperty()
    error?: any;

}
