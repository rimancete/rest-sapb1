import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse } from '../../../../../core/b1/service-layer/http/interfaces';
import { Exception } from '../../../../../core/exception';

export const MOVEMENT_TYPE = {
	ENTRY: 'entry',
	EXIT: 'exit',
	TRANSFER: 'transfer'
}

export class StockMovementItemBatchNumberRequest {
	@ApiProperty()
	batchNumber?: string;

	@ApiProperty()
	quantity?: number;
}

export class StockMovementItemRequest {

  @ApiProperty()
	projectCode: string;

	@ApiProperty()
	itemCode: string;

	@ApiProperty()
  quantity: number;
  
  price: number;

	@ApiProperty({ required: false })
	costCenterCode?: string;

	@ApiProperty({ required: true })
	warehouseCode?: string;

	@ApiProperty({ required: false })
	fromWarehouseCode?: string;
	
	costCenterType?: string;

	@ApiProperty({ isArray: true, type: StockMovementItemBatchNumberRequest })
	batchNumbers?: StockMovementItemBatchNumberRequest[];
}

export class StockMovementRequest {

	@ApiProperty()
  businessPlaceCode: number;  
  	
	@ApiProperty({ required: false })
	reference?: string;

	@ApiProperty({ format: 'YYYY-MM-DD' })
	movementDate: string;

	@ApiProperty({
		enum: [MOVEMENT_TYPE.ENTRY, MOVEMENT_TYPE.EXIT, MOVEMENT_TYPE.TRANSFER]
	})
	movementType: string;

	@ApiProperty()
	integrationType: string;

	@ApiProperty({ required: false })
  remarks?: string;

	@ApiProperty({ isArray: true, type: StockMovementItemRequest })
	items: StockMovementItemRequest[];
}

export class StockMovementItemData {

	@ApiProperty()
	itemCode: string;

	@ApiProperty()
	accountCode?: string;

	@ApiProperty()
  total?: number;  
  
	@ApiProperty()
	unitPrice?: number;

}

export class StockMovementData {

	@ApiProperty()
	movementCode?: string;

	@ApiProperty()
	movementValue?: number;

	@ApiProperty({ isArray: true, type: StockMovementItemData })
	items: StockMovementItemData[]

}



export class StockMovementResult implements HttpServiceResponse<StockMovementData> {

	@ApiProperty()
	data?: StockMovementData;

	@ApiProperty()
	error?: Exception;

}


