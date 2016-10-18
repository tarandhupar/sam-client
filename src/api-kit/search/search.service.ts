import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class SearchService {

    constructor(private oAPIService: WrapperService) {}

    runSearch(obj) {
      let oApiParam = {
        name: 'search',
        suffix: '/',
        oParam: {
          index: obj.index,
          q: obj.keyword,
          page: obj.pageNum,
          qFilters: {}
        },
        method: 'GET'
      };

      if(typeof obj.organizationId !== 'undefined' && obj.organizationId !== null) {
        oApiParam.oParam.qFilters['organizationId'] = obj.organizationId;
      }

      if(typeof obj.noticeId != 'undefined' && obj.noticeId != null) {
        oApiParam.oParam.qFilters['noticeId'] = obj.noticeId;
      }

      return this.oAPIService.call(oApiParam);
    }

}
