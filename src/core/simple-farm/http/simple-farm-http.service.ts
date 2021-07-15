import { Injectable, Scope, } from '@nestjs/common';
import { SimpleFarmResponse } from './interfaces';
import { ConfigService } from '../../config/config.service';
import { Exception } from '../../../core/exception';
import Axios, { AxiosInstance } from 'axios';
import * as https from 'https';
const Queue = require('better-queue');

@Injectable()
export class SimpleFarmHttpService {

	private axiosRef: AxiosInstance = Axios.create();
	private config = {};
	private GATEC_TOKEN: string;
	private queue: any;

	constructor(private readonly configService: ConfigService) {
		const env = this.configService.get();
		this.axiosRef.defaults.baseURL = env.GATEC_URL;
		this.axiosRef.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
		this.axiosRef.defaults.timeout = 1000 * 60 * 30;
		this.GATEC_TOKEN = env.GATEC_TOKEN;

		this.config = {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': this.GATEC_TOKEN
			}
		}

		this.queue = new Queue(async (data, callback) => {

			// console.log(data.path);
			
			try {
				const result = await this.axiosRef.post<SimpleFarmResponse>(data.path, data.data, this.config);

				if (result.data) {
					if (result.data.HasErrors) {
						callback({
							error: true,
							data: new Exception({
								code: 'SF001', message: "Erro ao incluir/atualizar o registro no SimpleFarm", request: data, response: result.data
							})
						});
					} else {
						callback({
							error: false,
							data: result.data
						});
					}
				} else {
					callback({
						error: true,
						data: new Exception({
							code: result.status.toString(), message: result.statusText, request: data, response: result
						})
					});
				}
			}
			catch (exception) {
				callback({
					error: true,
					data: new Exception({
						code: exception.status.toString(), message: exception.statusText, request: data, response: exception
					})
				});
			}

		},{concurrent: 3});

	}

	async post(path: string, data: any): Promise<SimpleFarmResponse> {

		const p = new Promise<SimpleFarmResponse>((resolve, reject) => {

			this.queue.push({ path, data }, (result) => {
        // console.log('result',result)
				if (result.error) {
					reject(result.data);
				} else {
					resolve(result.data);
				}
			});

		});

		return p;

	}

}
