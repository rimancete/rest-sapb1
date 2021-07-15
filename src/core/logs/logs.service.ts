import { Injectable, } from '@nestjs/common';
import { HanaLogService } from '../../core/b1/hana/log/log.service'
import { LogSuccessRequest, Log, LogType, LogErrorRequest } from './interface';
import { Exception } from '../exception';

@Injectable()
export class LogsService {
	constructor(
		private readonly hanaLogService: HanaLogService
	) { }

	async logSuccess(request: LogSuccessRequest): Promise<void> {

		const entity: Log = {
			LOGTYPECODE: LogType.SUCCESS,
			MODULE: request.module,
			MESSAGE: request.message || 'Registro incluído/atualizado com sucesso.',
			FULLMESSAGE: request.message || 'Registro incluído/atualizado com sucesso.',
			KEY: request.key,
			REQUESTOBJECT: request.requestObject,
			RESPONSEOBJECT: request.responseObject,
		};

		await this.hanaLogService.insertLog(entity);

	}

	async logError(request: LogErrorRequest): Promise<void> {

		if (Exception.isFarmmoneException(request.exception)) {

			const farmmoneException: Exception = request.exception;

			const entity: Log = {
				LOGTYPECODE: LogType.ERROR,
				MODULE: request.module,
				MESSAGE: farmmoneException.message || 'Erro ao incluir/atualizar registro.',
				FULLMESSAGE: farmmoneException.message || 'Erro ao incluir/atualizar registro.',
				KEY: request.key,
				REQUESTOBJECT: farmmoneException.request,
				RESPONSEOBJECT: farmmoneException.response,
			};

			await this.hanaLogService.insertLog(entity);

		} else {

			const entity: Log = {
				LOGTYPECODE: LogType.ERROR,
				MODULE: request.module,
				MESSAGE: request.exception.message || 'Erro ao incluir/atualizar registro.',
				FULLMESSAGE: request.exception.message || 'Erro ao incluir/atualizar registro.',
				KEY: request.key,
				REQUESTOBJECT: null,
				RESPONSEOBJECT: request.exception,
			};

			await this.hanaLogService.insertLog(entity);

		}


	}

}