import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { HttpServiceResponse } from '../http/interfaces';
import { LoginResponse, LoginRequest, ServiceLayerLoginRequest } from './interfaces';

@Injectable()
export class LoginService {

	@Inject('ConfigService') private readonly configService: any;

	constructor(private readonly httpService: HttpService) { }

	login(): Promise<HttpServiceResponse<LoginResponse>> {


		const env = this.configService.get();

		const companyDb = env.DATABASE_NAME;
		const username = env.SERVICE_LAYER_USERNAME;
		const password = env.SERVICE_LAYER_PASSWORD;

		const data: ServiceLayerLoginRequest = {
			CompanyDB: companyDb,
			Password: password,
			UserName: username
		};

		const config = { headers: { 'Content-Type': 'application/json' } };

		return this.httpService.post('Login', data, config).then(r => {
			if (r.error && r.error.innerMessage == 'Unauthorized') {
				r.error.message = 'Acesso não autorizado.';
			}
			return r;
		});
	}

	loginWithCredentials(request: LoginRequest): Promise<HttpServiceResponse<LoginResponse>> {

		const env = this.configService.get();

		const data: ServiceLayerLoginRequest = {
			CompanyDB: env.DATABASE_NAME,
			Password: request.password,
			UserName: request.username
		};

		const config = { headers: { 'Content-Type': 'application/json' } };

		return this.httpService.post('Login', data, config).then(r => {
			if (r.error && r.error.innerMessage == 'Unauthorized') {
				r.error.message = 'Acesso não autorizado.';
      }
			return r;
		});
	}


	logout(): Promise<HttpServiceResponse<LoginResponse>> {
		return this.httpService.post('Logout');
	}
}
