import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import 'rxjs/add/operator/map';

@Injectable()
export class SuggestionsService {

  constructor(private oAPIService:WrapperService) {}

  autosearch(oData) {
    let oApiParam = {
      name: 'suggestions',
      suffix: '/',
      oParam: {
        index: oData.index,
        q: oData.keyword
      },
      method: 'GET'
    };
    if (oData['pageSize']) {
      oApiParam.oParam['size'] = oData['pageSize'];
    }

    return this.oAPIService.call(oApiParam);
  }
}
