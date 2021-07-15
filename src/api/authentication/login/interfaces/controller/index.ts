import { AuthenticationServiceResponse } from "../service";
import { ApiProperty } from '@nestjs/swagger';
import { HttpServiceResponse } from "../../../../../core/b1/service-layer/http/interfaces";

export class LoginControllerRequest {
	@ApiProperty()
	username: string;

	@ApiProperty()
	password: string;
}

export type LoginControllerResponse = HttpServiceResponse<AuthenticationServiceResponse>
