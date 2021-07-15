import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service';
import { BatchRequest } from '../http/interfaces';
import * as _ from 'lodash';

const CHUNK_SIZE = 500;
const CHUNK_SIZE_SPLIT = 50;

@Injectable()
export class BatchRequestService extends ODataService<any> {

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(data: BatchRequest, onProgress: any = (index: number, size: number) => { }) {

    const _session = this._session;

    const result = [];

    if (data.hasChanges()) {
      const chunked = _.chunk(data.requests(), CHUNK_SIZE);
      let current = 1;
      for (const list of chunked) {
  
        onProgress(current, chunked.length);
  
        const chunkedList = _.chunk(list, CHUNK_SIZE_SPLIT);
        const chunkedPromises = chunkedList.map((splitList, index) => {
  
          return new Promise((resolve) => {
  
            setTimeout(() => {
  
              const batchRequest = new BatchRequest();
              splitList.forEach(split => {
                batchRequest.addRequest(split);
              });
  
              this.session(_session).batch(batchRequest).then((batchResult) => { 
                if (batchResult && !batchResult.error && batchResult.data){
                  batchResult.data.forEach(d => {
                    if (!d.error) {
                      result.push(d.data);
                    }
                  })
                } else {
                  if (batchResult.error) {
                    console.log(batchResult.error);
                  }
                }
                resolve(); 
              });
  
            }, index * 5000);
  
          });
        });
  
        await Promise.all(chunkedPromises);
  
        current++;
  
      }
    }  

    return result;    

  }


}
