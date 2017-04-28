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

    if(obj.index=="") {
      oApiParam.oParam['index'] = "cfda,opp,fh,ent,ex,wd,fpds";
    }

    //Active Only filter
    if(obj.isActive === true) {
      oApiParam.oParam['is_active'] = obj.isActive;
    }

    // wage determination type filter
    if(typeof obj.wdType !== 'undefined' && obj.organizationId !== null && obj.wdType !== '') {
        oApiParam.oParam['index'] = obj.wdType;
      }

    // organization id filter
    if(typeof obj.organizationId !== 'undefined' && obj.organizationId !== null && obj.organizationId !== '') {
      oApiParam.oParam['organization_id'] = obj.organizationId;
    }

    // construction type filter
    if(typeof obj.conType !== 'undefined' && obj.conType !== null && obj.conType !== '') {
      oApiParam.oParam['construction_type'] = obj.conType;
    }

    // selectStateModel
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

    // isstandard filter
    if(typeof obj.isStandard !== 'undefined' && obj.isStandard !== null && obj.isStandard !== ''){
      if(obj.isStandard === 'true'){
        oApiParam.oParam['is_standard'] = true;
      }
      else if(obj.isStandard === 'false'){
        oApiParam.oParam['is_standard'] = false;
      }
    }

    // award Filters
    if(typeof obj.awardOrIdv !== 'undefined' && obj.awardOrIdv !== null && obj.awardOrIdv !== ''){
      oApiParam.oParam['award_or_IDV'] = obj.awardOrIdv;
    }

    if(typeof obj.awardType !== 'undefined' && obj.awardType !== null && obj.awardType !== ''){
      oApiParam.oParam['award_type'] = obj.awardType;
    }

    if(typeof obj.contractType !== 'undefined' && obj.contractType !== null && obj.contractType !== ''){
      oApiParam.oParam['contract_type'] = obj.contractType;
    }

    if(typeof obj.naics !== 'undefined' && obj.naics !== null && obj.naics !== ''){
      oApiParam.oParam['naics'] = obj.naics;
    }

    if(typeof obj.psc !== 'undefined' && obj.psc !== null && obj.psc !== ''){
      oApiParam.oParam['psc'] = obj.psc;
    }

    //showRegionalOffices only when
    if(obj.showRO) {
      oApiParam.oParam['q'] = obj.ro_keyword;
      oApiParam.oParam['index'] = 'ro';
    }

    if(typeof obj.duns !== 'undefined' && obj.duns !== null && obj.duns !== ''){
      oApiParam.oParam['duns'] = obj.duns;
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
