import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { WrapperService } from '../wrapper/wrapper.service';
import 'rxjs/add/operator/map';


@Injectable()
export class SearchService {
    private params = new Subject<Object>();
    paramsUpdated$ = this.params.asObservable();
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

  featuredSearch(obj) {
    let oApiParam = {
      name: 'featuredSearch',
      suffix: '/',
      oParam: {
        q: obj.keyword,
        qFilters: {}
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }


  loadParams(obj){
      this.params.next(obj);
    }

}
