import * as uuid from 'uuid/v4';
import { ApiProperty } from '@nestjs/swagger';

export interface HttpServiceResponse<T> {  
  error?: HttpServiceError,  
  data?: T
}

export class HttpServiceError {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  innerMessage?: string;
}


export enum RequestMethodType {
  "GET" = "GET",
  "POST" = "POST",
  "PATCH" = "PATCH",
  "PUT" = "PUT",
  "DELETE" = "DELETE"
}

export interface Request {
  id?: string;
  data?: any;
  method: RequestMethodType;
  path: string;
}



export class BatchRequest {

  private _requests: Request[] = [];
  private _changesets: Changeset[] = [];
  private _id: string;
  private _batchId: string;
  replaceCollections: any;

  constructor(requests: Request[] = null) {
    this._id = uuid();
    this._batchId = "batch_" + this._id;

    if (requests) {
      requests.forEach(r => {
        this._requests.push(r);      
      });
    }
  }

  addRequest(request: Request) {
    this._requests.push(request);
  }

  batchId() {
    return this._batchId;
  }

  id() {
    return this._id;
  }

  requests(): Request[] {
    return this._requests;
  }

  hasChanges(): boolean {
    return this._requests.length > 0;
  }

  raw() {
    return `
${this._requests.map(r => {
      if (r.method == RequestMethodType.GET) {
        return `--${this._batchId}
Content-Type: application/http
Content-Transfer-Encoding:binary

${r.method.toString()} /b1s/v1/${r.path};

`;
      } else {
        return `--${this._batchId}
Content-Type: application/http
Content-Transfer-Encoding:binary

${r.method.toString()} /b1s/v1/${r.path}${r.id ? `(${r.id})` : ''}
${r.data ? `
${JSON.stringify(r.data)}
` : ``}
`;
      }
    }).join('')}
--${this._batchId}--
`;
  }
}

class Changeset {

  private _requests: Request[] = [];
  private _id: string;

  constructor() {
    this._id = uuid();
  }

  addRequest(request: Request) {
    this._requests.push(request);
  }

}