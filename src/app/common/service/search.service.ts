import { Injectable } from '@angular/core';
import { APIService } from './api/api.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class SearchService {

    constructor(private oAPIService: APIService) {}

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

      return this.oAPIService.call(oApiParam);
    }

}
