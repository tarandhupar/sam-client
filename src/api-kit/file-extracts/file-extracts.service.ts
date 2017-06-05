import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";

@Injectable()
export class FileExtractsService {
  constructor(private apiService:WrapperService) {
  }

  getFilesList(domain){
    let apiOptions: any = {
      name: 'fileExtracts',
      suffix: '',
      method: 'GET',
      oParam: {}
    };
    if(domain.length > 0) apiOptions.oParam.domain = domain;
    return this.apiService.call(apiOptions);
  }


}
