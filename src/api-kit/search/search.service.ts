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
        page: obj.pageNum
      },
      method: 'GET'
    };

    // wage determination type filter
    if(typeof obj.wdType !== 'undefined' && obj.wdType !== null) {
      oApiParam.oParam['index'] = obj.wdType;
    } else {
      oApiParam.oParam['index'] = obj.index;
    }

    // construction type filter
    if(typeof obj.conType !== 'undefined' && obj.conType !== null && obj.conType !== '') {
      oApiParam.oParam['construction_type'] = obj.conType;
    }

    // selectStateModel
    if(typeof obj.state !== 'undefined' && obj.state !== null && obj.state !== '') {
      oApiParam.oParam['state'] = obj.state;
    }

    // is active filter
    if(obj.isActive === true) {
      oApiParam.oParam['is_active'] = obj.isActive;
    }

    if(typeof obj.organizationId !== 'undefined' && obj.organizationId !== null) {
      oApiParam.oParam['organization_id'] = obj.organizationId;
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
