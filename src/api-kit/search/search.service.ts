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
        is_active: obj.isActive
      },
      method: 'GET'
    };

    // wage determination type filter
    if(typeof obj.wdType !== 'undefined' && obj.wdType !== null) {
        oApiParam.oParam['index'] = obj.wdType;
      }

        // construction type filter
        if(typeof obj.conType !== 'undefined' && obj.conType !== null && obj.conType !== '') {
          oApiParam.oParam['construction_type'] = obj.conType;
        }

        // state filter
        if(typeof obj.state !== 'undefined' && obj.state !== null && obj.state !== '') {
          oApiParam.oParam['state'] = obj.state;
        }

        // county filter
        if(typeof obj.county !== 'undefined' && obj.county !== null && obj.county !== '') {
          oApiParam.oParam['county'] = obj.county;
        }

        // service filter
        if(typeof obj.service !== 'undefined' && obj.service !== null && obj.service !== '') {
          oApiParam.oParam['service'] = obj.service;
        }

        // iseven filter
        if(typeof obj.isEven !== 'undefined' && obj.isEven !== null && obj.isEven !== '') {
          if(obj.isEven === 'true'){
            oApiParam.oParam['is_even'] = true;
          }
          else if(obj.isEven === 'false'){
        oApiParam.oParam['is_even'] = false;
      }
    }

    if(typeof obj.noticeId != 'undefined' && obj.noticeId != null) {
      oApiParam.oParam['noticeId'] = obj.noticeId;
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
