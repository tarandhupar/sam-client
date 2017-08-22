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
      oApiParam.oParam['index'] = "cfda,opp,fh,ei,wd,fpds";
    }

    //Active Only filter
    if(obj.is_active === true) {
      oApiParam.oParam['is_active'] = obj.is_active;
    }

    // wage determination type filter
    if(typeof obj.wdType !== 'undefined' && obj.organization_id !== null && obj.wdType !== '') {
        oApiParam.oParam['index'] = obj.wdType;
      }

    // organization id filter
    if(typeof obj.organization_id !== 'undefined' && obj.organization_id !== null && obj.organization_id !== '') {
      oApiParam.oParam['organization_id'] = obj.organization_id;
    }

    // construction type filter
    if(typeof obj.construction_type !== 'undefined' && obj.construction_type !== null && obj.construction_type !== '') {
      oApiParam.oParam['construction_type'] = obj.construction_type;
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
    if(typeof obj.is_even !== 'undefined' && obj.is_even !== null && obj.is_even !== '') {
      if(obj.is_even === 'true'){
        oApiParam.oParam['is_even'] = true;
      }
      else if(obj.is_even === 'false'){
        oApiParam.oParam['is_even'] = false;
      }
    }

    // isstandard filter
    if(typeof obj.is_standard !== 'undefined' && obj.is_standard !== null && obj.is_standard !== ''){
      if(obj.is_standard === 'true'){
        oApiParam.oParam['is_standard'] = true;
      }
      else if(obj.is_standard === 'false'){
        oApiParam.oParam['is_standard'] = false;
      }
    }

    // award Filters
    if(typeof obj.award_or_idv !== 'undefined' && obj.award_or_idv !== null && obj.award_or_idv !== ''){
      oApiParam.oParam['award_or_idv'] = obj.award_or_idv;
    }

    if(typeof obj.award_type !== 'undefined' && obj.award_type !== null && obj.award_type !== ''){
      oApiParam.oParam['award_type'] = obj.award_type;
    }

    if(typeof obj.contract_type !== 'undefined' && obj.contract_type !== null && obj.contract_type !== ''){
      oApiParam.oParam['contract_type'] = obj.contract_type;
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

    if(typeof obj.applicant !== 'undefined' && obj.applicant !== null && obj.applicant !== ''){
      oApiParam.oParam['applicant'] = obj.applicant;
    }

    if(typeof obj.beneficiary !== 'undefined' && obj.beneficiary !== null && obj.beneficiary !== ''){
      oApiParam.oParam['beneficiary'] = obj.beneficiary;
    }

    if(typeof obj.assistance_type !== 'undefined' && obj.assistance_type !== null && obj.assistance_type !== ''){
      oApiParam.oParam['assistance_type'] = obj.assistance_type;
    }

    if(typeof obj.entity_type !== 'undefined' && obj.entity_type !== null && obj.entity_type.length == 1 && (obj.entity_type.indexOf('ent') > -1 || obj.entity_type.indexOf('ex') > -1)) {
      oApiParam.oParam['index'] = obj.entity_type.join(',');
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
