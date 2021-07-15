import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';
import { Exception } from '../../../../../core/exception';

export class PurchaseRequestItemRequest {
	@ApiProperty()
	itemCode: string;

	buyerCode: string;
	buyerName: string;

	@ApiProperty()
  quantity: number;  
  
	@ApiProperty({ required: false })
  reference?: string;
  
	@ApiProperty({ required: false })
	remarks?: string;
  
	@ApiProperty({ required: false })
	warehouseCode?: string;

	@ApiProperty({ required: false })
	costCenterCode?: string;
}

export class PurchaseRequestRequest {

	@ApiProperty()
  businessPlaceCode: number;
  
	@ApiProperty({ required: false })
	reference?: string;

	@ApiProperty({ format: 'YYYY-MM-DD' })
  requestDate: string;
  
  @ApiProperty()
  requester: string;

  @ApiProperty()
  type: number;

	@ApiProperty({ required: false })
	remarks?: string;

	@ApiProperty({ isArray: true, type: PurchaseRequestItemRequest })
	items: PurchaseRequestItemRequest[]
}

export class PurchaseItemData {

	@ApiProperty()
	itemCode?: string;

	@ApiProperty()
	accountCode?: string;

}

export class PurchaseRequestData {

	@ApiProperty()
	requestCode?: string;

	@ApiProperty({ isArray: true, type: PurchaseItemData })
	items: PurchaseItemData[];

}

export class PurchaseRequestResult implements HttpServiceResponse<PurchaseRequestData> {

	@ApiProperty()
	data?: PurchaseRequestData;

	@ApiProperty()
	error?: Exception;

}


