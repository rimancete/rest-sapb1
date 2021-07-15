import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, of, from } from 'rxjs';
import * as https from 'https';
import { map, catchError } from 'rxjs/operators';
import { HttpServiceResponse, BatchRequest } from './interfaces';
import * as _ from 'axios';

@Injectable()
export class HttpService {

	private axiosRef: AxiosInstance = Axios.create();
	private _session: string;

	constructor(private readonly configService: ConfigService) {

		const requestInterceptor = (config: { headers: any; }) => {

			const avoidIntercept = ['Login'];
			let cookie = '';

			if (avoidIntercept.indexOf(config['url']) == -1) {
				if (this._session) {
					cookie = `B1SESSION=${this._session}`;
				}
			}

			config.headers = {
				...config.headers,
				'B1S-CaseInsensitive': true,
				Cookie: cookie
			};

			this._session = null;
			return config;
		}

		const env = this.configService.get();
		this.axiosRef.defaults.baseURL = env.SERVICE_LAYER_URL;
		this.axiosRef.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
		this.axiosRef.defaults.timeout = 1000 * 60 * 30;
		this.axiosRef.interceptors.request.use(requestInterceptor);

	}

	responseHandler(r: AxiosResponse): HttpServiceResponse<any> {
		const result: HttpServiceResponse<any> = {
			error: null,
			data: r.data
		}
		return result;
	}

	batchResponseHandler(r: AxiosResponse): HttpServiceResponse<any> {

		const batchResponses = [];

		const headerContentType = r.headers['content-type'];
		const boundary = headerContentType.replace('multipart/mixed;boundary=', '');

		const batchPartRegex = RegExp("--" + boundary + "(?:\r\n)?(?:--\r\n)?");
		const batchParts = r.data.split(batchPartRegex).filter(p => p.trim() != "").map(p => p.trim());
		const contentTypeRegExp = RegExp("^content-type", "i");

		for (let i = 0; i < batchParts.length; i++) {

			const batchPart = batchParts[i];
			if (contentTypeRegExp.test(batchPart)) {
				const rawResponse = batchPart.split("\r\n\r\n");

				const httpResponseWithHeaders = rawResponse[1].split("\r\n");
				const responseRegex = RegExp("HTTP/1.1 ([0-9]{3}) (.+)");
				const httpCodeAndDesc = httpResponseWithHeaders[0].match(responseRegex);
				const httpCode = parseInt(httpCodeAndDesc[1]);
				const httpDesc = httpCodeAndDesc[2];

				if (httpCode == 200 || httpCode == 201 || httpCode == 202) {
					const result: HttpServiceResponse<any> = {
						error: null,
						data: JSON.parse(rawResponse[2])
					}
					batchResponses.push(result);
				}
				else if (httpCode == 204) {
					const result: HttpServiceResponse<any> = {
						error: null,
						data: null
					}
					batchResponses.push(result);
				}
				else {
					const errorData = JSON.parse(rawResponse[2]);
					if (httpCode == 400 && errorData.error && errorData.error.message) {
						const result: HttpServiceResponse<any> = {
							error: {
								code: httpCode.toString(),
								innerMessage: errorData.error.message.value.toString()
							}
						}
						batchResponses.push(result);
					}
					else {
						const result: HttpServiceResponse<any> = {
							error: {
								code: httpCode.toString(),
								innerMessage: httpDesc
							}
						}
						batchResponses.push(result);
					}
				}
			}
		}

		const result: HttpServiceResponse<any> = {
			error: null,
			data: batchResponses
		}

		return result;
	}

	errorHandler(r: AxiosResponse): HttpServiceResponse<any> {
		if (r.status == 400 && r.data.error && r.data.error.message) {
			const result: HttpServiceResponse<any> = {
				error: {
					code: r.status.toString(),
					innerMessage: r.data.error.message.value.toString()
				}
			}
			return result;
		}
		else {
			const result: HttpServiceResponse<any> = {
				error: {
					code: r.status.toString(),
					innerMessage: r.statusText
				}
			}
			return result;
		}
	}

	catchErrorHandler(r: any): Observable<HttpServiceResponse<any>> {
		if (r.response) {
			if (r.response.status == 400 && r.response.data.error && r.response.data.error.message) {
				const result: HttpServiceResponse<any> = {
					error: {
						code: r.response.status,
						innerMessage: r.response.data.error.message.value.toString()
					}
				}
				return of(result);
			}
			else {
				const result: HttpServiceResponse<any> = {
					error: {
						code: r.response.status,
						innerMessage: r.response.statusText.toString()
					}
				}
				return of(result);
			}
		} else {
			const result: HttpServiceResponse<any> = {
				error: {
					code: '500',
					innerMessage: r.toString(),
					message: "Não foi possível conectar ao servidor. Tente novamente."
				}
			}
			return of(result);
		}

	}

	session(value: string) {
		this._session = value;
		return this;
	}

	post(path: string, data?: any, config?: AxiosRequestConfig): Promise<HttpServiceResponse<any>> {
		return from(this.axiosRef.post(path, data, config))
			.pipe(map(r => {
				if (r.status == 200 || r.status == 201 || r.status == 204) {
					return this.responseHandler(r);
				}
				else {
					return this.errorHandler(r);
				}
			}))
			.pipe(catchError((r) => this.catchErrorHandler(r)))
			.toPromise();
	}

	get(path: string, config?: AxiosRequestConfig): Promise<any> {
		return from(this.axiosRef.get(path, config))
			.pipe(map(r => {
				if (r.status == 200) {
					return this.responseHandler(r);
				}
				else {
					return this.errorHandler(r);
				}
			}))
			.pipe(catchError((r) => this.catchErrorHandler(r)))
			.toPromise();
	}

	patch(path: string, data?: any, config?: AxiosRequestConfig): Promise<HttpServiceResponse<any>> {
		config = config || { headers: {} };
		config.headers['X-HTTP-Method-Override'] = 'PATCH';
		return from(this.axiosRef.post(path, data, config))
			.pipe(map(r => {
				if (r.status == 204) {
					return this.responseHandler(r);
				}
				else {
					return this.errorHandler(r);
				}
			}))
			.pipe(catchError((r) => {
				return this.catchErrorHandler(r);
			}))
			.toPromise();
	}

	batch(data?: BatchRequest, config?: AxiosRequestConfig) {

		config = config || { headers: {} };
		config.headers['Content-Type'] = 'multipart/mixed;boundary=' + data.batchId();
		if (data.replaceCollections) {
			config.headers['B1S-ReplaceCollectionsOnPatch'] = true;
		}

		return from(this.axiosRef.post('$batch', data.raw(), config))
			.pipe(map(r => {
				if (r.status == 202 || r.status == 201 || r.status == 200) {
					return this.batchResponseHandler(r);
				}
				else {
					return this.errorHandler(r);
				}
			}))
			.pipe(catchError((r) => {
				return this.catchErrorHandler(r);
			}))
			.toPromise();
	}
}
