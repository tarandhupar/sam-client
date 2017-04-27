import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";

@Injectable()
export class AACRequestService {
  constructor(private apiService:WrapperService) {
  }

  getAACRequestDetail(requestId){

    let apiOptions: any = {
      name: 'aac',
      suffix: '/aacDetails/'+requestId,
      method: 'GET',
      oParam: {}
    };

    return this.apiService.call(apiOptions);
  }

  getAACRequestFormDetail(){
    let apiOptions: any = {
      name: 'aac',
      suffix: '/requestDetails',
      method: 'GET',
      oParam: {}
    };

    return this.apiService.call(apiOptions);
  }

  postAACRequest(aacObj){
    let apiOptions: any = {
      name: 'aac',
      suffix: '',
      method: 'POST',
      body: aacObj,
      oParam: {}
    };

    return this.apiService.call(apiOptions);
  }

}
