import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse } from '../../../../../core/b1/service-layer/http/interfaces';
import { Exception } from '../../../../../core/exception';

export const MOVEMENT_TYPE = {
	DEVOLUCAO: 'D',
	REQUISICAO: 'R'
}

export class StockTransferItemRequestRequest {
	@ApiProperty()
	itemCode: string;

	@ApiProperty()
  quantity: number;
  
	@ApiProperty({ required: false })
	reference?: string;
  
	@ApiProperty({ required: false })
  remarks?: string;

	@ApiProperty({ required: false })
	warehouseCode?: string;

	toWarehouseCode?: string;

	@ApiProperty({ required: false })
	costCenterCode?: string;
}

export class StockTransferRequestRequest {

	@ApiProperty()
	businessPlaceCode: number;

	@ApiProperty({ required: false })
	reference?: string;

	@ApiProperty({ format: 'YYYY-MM-DD' })
	requestDate: string;

	@ApiProperty({ required: false })
  remarks?: string;
   
  @ApiProperty({
		enum: [MOVEMENT_TYPE.DEVOLUCAO, MOVEMENT_TYPE.REQUISICAO]
	})
	type: string;

	@ApiProperty({ isArray: true, type: StockTransferItemRequestRequest })
	items: StockTransferItemRequestRequest[]
}

export class StockTransferItemRequestData {
	@ApiProperty()
	itemCode?: string;
}

export class StockTransferRequestData {

	@ApiProperty()
	requestCode?: string;

	@ApiProperty({ isArray: true, type: StockTransferItemRequestData })
	items?: StockTransferItemRequestData[];

}

export class StockTransferRequestResult implements HttpServiceResponse<StockTransferRequestData> {

	@ApiProperty()
	data?: StockTransferRequestData;

	@ApiProperty()
	error?: Exception;

}


