import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse, HttpServiceError } from '../../../../../core/b1/service-layer/http/interfaces';
import { Exception } from '../../../../../core/exception';

export class PurchasOrdersItemRequest {
	@ApiProperty()
	itemCode: string;

	@ApiProperty()
	quantity: number;

	@ApiProperty()
	price: number;

	@ApiProperty({ required: false })
	costCenterCode?: string;

  warehouseCode?: string
  
  BaseEntry?: number
  BaseLine?: number
  BaseType?: number
}

export class PurchaseOrdersRequest {

	@ApiProperty()
	businessPlaceCode: number;

	@ApiProperty({ required: false })
	reference?: string;

	@ApiProperty()
	projectCode: string;

	@ApiProperty({ format: 'YYYY-MM-DD' })
	documentDate: string;

	@ApiProperty({ format: 'YYYY-MM-DD' })
	documentDueDate: string;

	@ApiProperty()
	partnerCode: string;

	@ApiProperty()
	contractCode: string;

	@ApiProperty()
	orderType: string;

	@ApiProperty({ required: false })
	discountValue: number;

	@ApiProperty({ required: false })
	remarks?: string;

	@ApiProperty({ isArray: true, type: PurchasOrdersItemRequest })
	items: PurchasOrdersItemRequest[]
}

export class PurchaseOrdersItemData {

	@ApiProperty()
	itemCode?: string;

	@ApiProperty()
	accountCode?: string;

}

export class PurchaseOrdersData {

	@ApiProperty()
	requestCode?: string;

	@ApiProperty({ isArray: true, type: PurchaseOrdersItemData })
	items: PurchaseOrdersItemData[];

}

export class PurchaseOrdersResult implements HttpServiceResponse<PurchaseOrdersData> {

	@ApiProperty()
	data?: PurchaseOrdersData;

	@ApiProperty()
	error?: Exception;

}


