import { Injectable } from '@nestjs/common';
import { LoginService } from '../../../core/b1/service-layer/login/login.service';
import { HttpServiceResponse } from '../../../core/b1/service-layer/http/interfaces';
import { AuthenticationServiceResponse } from './interfaces/service';
import * as _ from 'lodash';

@Injectable()
export class AuthenticationService {
	constructor(private readonly loginService: LoginService) { }

	async logout(): Promise<HttpServiceResponse<AuthenticationServiceResponse>> {

		await this.loginService.logout();

		const response: HttpServiceResponse<AuthenticationServiceResponse> = {
			error: null
		};

		return response;

	}

	async login(username: string, password: string): Promise<HttpServiceResponse<AuthenticationServiceResponse>> {

		const response: HttpServiceResponse<AuthenticationServiceResponse> = {
			error: null
		};
    
    const loginResponse = await this.loginService.loginWithCredentials({ username, password });
  
		const { error: loginError, data: loginData } = loginResponse;

		if (!loginError) {
			response.data = {
				session: loginData.SessionId,
				timeout: loginData.SessionTimeout
			}
		} else {
			response.error = {
				code: 'L0001',
				innerMessage: loginResponse.error.innerMessage,
				message: 'Acesso não permitido.'
			};
		}
		return response;
	}
}
