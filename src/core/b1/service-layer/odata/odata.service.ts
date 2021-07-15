import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import buildQuery from 'odata-query';
import { ODataResponse } from './interfaces';
import { BatchRequest } from '../http/interfaces';

@Injectable()
export class ODataService<T> {

  @Inject('HttpService')
  public readonly httpService: HttpService;
  public path: string;
  public _session: string;
  
  session(token: string) {
    this._session = token;
    this.httpService.session(token);
    return this;
  }

  getOne(id: any, odata = ''): Promise<ODataResponse<T>> {
    const key = buildQuery({ key: id });
    return  from(this.httpService.get(this.path + key + odata))
            .pipe(map(r => {
              if (r.error && r.message == 'Not Found') {
                return {
                  error: false,
                  message: '',
                  data: null
                };
              }
              else {
                if (r.data && r.data['odata.metadata']){
                  delete r.data['odata.metadata'];
                }
                return {...r}
              }
            }))
            .toPromise();
  }

  get(odata = ''): Promise<ODataResponse<Array<T>>> {
    return  from(this.httpService.get(this.path + odata))
            .pipe(map(r => {
              let count;
                            
              if (r.data && r.data['odata.metadata']){
                delete r.data['odata.metadata'];
              }
              if (r.data && r.data['odata.count']){
                count = r.data['odata.count'];
                delete r.data['odata.count'];
              }
              return {...r, data: r.data ? r.data.value : null, count}
            }))            
            .toPromise();    
  }

  delete(): Promise<any> {
    return this.httpService.get(this.path);
  }

  create(entity: T): Promise<any> {
    return  from(this.httpService.post(this.path, entity))
            .pipe(map(r => {              
              if (r.data && r.data['odata.metadata']){
                delete r.data['odata.metadata'];
              }
              return {...r}
            }))
            .toPromise();
  }

  update(id: any, entity: T, replace: boolean = false): Promise<any> {
    const key = buildQuery({ key: id });
    const config = { headers: {} };
    if (replace) {
      config.headers = {
        'B1S-ReplaceCollectionsOnPatch': true
      }
    }
    return  from(this.httpService.patch(this.path + key, entity, config))
            .pipe(map(r => {              
              if (r.data && r.data['odata.metadata']){
                delete r.data['odata.metadata'];
              }
              return {...r}
            }))
            .toPromise();
  }

  batch(data: BatchRequest): Promise<any> {
    return  from(this.httpService.batch(data))
            .pipe(map(r => {              
              if (r.data && r.data['odata.metadata']){
                delete r.data['odata.metadata'];
              }
              return {...r}
            }))
            .toPromise();
  }

}