export class Exception {
	code: string;
	message: string;
	request: string;
	response: string;
	farmmone = true;
	constructor(private data: { code: string, message: string, request: any, response: any }) {
		this.code = data.code;
		this.message = data.message;
		this.request = data.request;
		this.response = data.response;
		delete this.data;
	}

	static isFarmmoneException(exception: any) {
		return exception && exception.farmmone && exception.farmmone == true;
	}
}