
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import Axios, { AxiosInstance } from 'axios';
import { ConnectionOptions, createConnection } from '@ibsolution/types-hana-client';
import { DatabaseResponse } from './interfaces';

@Injectable()
export class DatabaseService<T> {

	isHTTP: boolean;
	options: ConnectionOptions;
	databaseName: string;

	private axiosRef: AxiosInstance = Axios.create();

	constructor(private readonly configService: ConfigService) {

		const env = this.configService.get();

		this.databaseName = env.DATABASE_NAME;

		if (env.DATABASE_HOST.indexOf('http') >= 0) {
			this.isHTTP = true;
			this.axiosRef.defaults.baseURL = env.DATABASE_HOST;
		} else {
			this.isHTTP = false;
			this.options = {
				host: env.DATABASE_HOST,
				port: parseInt(env.DATABASE_PORT),
				uid: env.DATABASE_USER,
				pwd: env.DATABASE_PASSWORD,
			};
		}


	}

	getTableName(tableName: string) {
		return `${this.databaseName}."${tableName}"`;
	}

	execBatch(query: string, values: any[]): Promise<DatabaseResponse<T>> {

		const connection = createConnection(this.options);

		return new Promise((resolve) => {

			const disconnect = () => connection.disconnect(() => { return true; });
			const response: DatabaseResponse<T> = {};

			try {
				connection.connect(null, connectionError => {
					if (!connectionError) {
						try {
							connection.prepare(query, (prepareError, stmt) => {
								if (!prepareError) {
									stmt.execBatch<T>(values, (execError, results: any) => {
										if (!execError) {
											response.data = results;

											if (results.length > 0 && results[0]['TOTALROWS']) {
												response.count = results[0]['TOTALROWS'];
											}
											else {
												response.count = 0;
											}
											resolve(response);
										}
										else {
											response.error = { code: 'D00002', innerMessage: execError.message, message: 'Falha na consulta ao banco de dados.' }
											resolve(response);
										}
										disconnect();
										return;
									});
								}
								else {
									response.error = { code: 'D00001', innerMessage: prepareError.message, message: 'Falha na conexão com o banco de dados.' }
									resolve(response);
								}
							});
						}
						catch (ex) {
							response.error = { code: 'D00003', innerMessage: connectionError.message, message: ex.message };
							resolve(response);
						}
					}
					else {
						response.error = { code: 'D00001', innerMessage: connectionError.message, message: 'Falha na conexão com o banco de dados.' }
						resolve(response);
					}
				});
			}
			catch (ex) {
				response.error = { code: 'D00001', innerMessage: ex.message, message: 'Falha na conexão com o banco de dados.' }
				resolve(response);
			}
		});

	}

	execute(query: string): Promise<T> {

		if (this.isHTTP) {

			return new Promise((resolve, reject) => {
				this.axiosRef.post('/hana', { query }).then(result => {
					const response = result.data;
					if (response.error) {
						console.log(response.error);
						reject(response.error)
					} else {
						resolve(response.data);
					}
				});
			});

		} else {

			const connection = createConnection(this.options);

			return new Promise((resolve, reject) => {

				const disconnect = () => connection.disconnect(() => { return true; });
				const response: DatabaseResponse<T> = {};

				try {
					connection.connect(null, connectionError => {
						if (!connectionError) {
							try {
								connection.exec<T>(query, (execError, results: any) => {
									if (!execError) {
										response.data = results;

										if (results.length > 0 && results[0]['TOTALROWS']) {
											response.count = results[0]['TOTALROWS'];
										}
										else {
											response.count = results.length;
										}
										resolve(response.data);
									}
									else {
										response.error = { code: 'D00002', innerMessage: execError.message, message: 'Falha na consulta ao banco de dados.' }
										console.log(response.error);
										reject(response.error)
									}
									disconnect();
									return;
								});
							}
							catch (ex) {
								response.error = { code: 'D00003', innerMessage: connectionError.message, message: ex.message };
								console.log(response.error);
								reject(response.error)
							}
						}
						else {
							response.error = { code: 'D00001', innerMessage: connectionError.message, message: 'Falha na conexão com o banco de dados.' }
							console.log(response.error);
							reject(response.error)
						}
					});
				}
				catch (ex) {
					response.error = { code: 'D00001', innerMessage: ex.message, message: 'Falha na conexão com o banco de dados.' }
					console.log(response.error);
					reject(response.error)
				}
			});
		}
	}

	exec(query: string): Promise<DatabaseResponse<T>> {

		if (this.isHTTP) {

			return new Promise((resolve) => {
				this.axiosRef.post('/hana', { query }).then(result => {
					resolve(result.data);
				});
			});

		} else {

			const connection = createConnection(this.options);

			return new Promise((resolve) => {

				const disconnect = () => connection.disconnect(() => { return true; });
				const response: DatabaseResponse<T> = {};

				try {
					connection.connect(null, connectionError => {
						if (!connectionError) {
							try {
								connection.exec<T>(query, (execError, results: any) => {
									if (!execError) {
										response.data = results;

										if (results.length > 0 && results[0]['TOTALROWS']) {
											response.count = results[0]['TOTALROWS'];
										}
										else {
											response.count = results.length;
										}

										resolve(response);
									}
									else {
										response.error = { code: 'D00002', innerMessage: execError.message, message: 'Falha na consulta ao banco de dados.' }
										resolve(response);
									}
									disconnect();
									return;
								});
							}
							catch (ex) {
								response.error = { code: 'D00003', innerMessage: connectionError.message, message: ex.message };
								resolve(response);
							}
						}
						else {
							response.error = { code: 'D00001', innerMessage: connectionError.message, message: 'Falha na conexão com o banco de dados.' }
							resolve(response);
						}
					});
				}
				catch (ex) {
					response.error = { code: 'D00001', innerMessage: ex.message, message: 'Falha na conexão com o banco de dados.' }
					resolve(response);
				}
			});
		}
	}

	markAsIntegrated(table: string, field: string, value: string, ): Promise<DatabaseResponse<T>> {
		return this.exec(`UPDATE ${this.databaseName}.${table} SET "U_ALFA_Integrated" = 'Y' WHERE "${field}" = '${value}'`);
	}


}
