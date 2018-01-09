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
    if(typeof obj.wdType !== 'undefined' && obj.wdType !== null && obj.wdType !== '') {
        oApiParam.oParam['index'] = obj.wdType;
      }
    //This block is needed to meet the business logic for SCA WD's as per SAM-18764. To show only standard SCA's on empty search.
    if(obj.index=="wd" && obj.keyword=="") {
      oApiParam.oParam['is_standard'] = true;
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
    if(typeof obj.is_wd_even !== 'undefined' && obj.is_wd_even !== null && obj.is_wd_even !== '') {
      if(obj.is_wd_even === 'true'){
        oApiParam.oParam['is_wd_even'] = true;
      }
      else if(obj.is_wd_even === 'false'){
        oApiParam.oParam['is_wd_even'] = false;
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

    if(typeof obj.duns !== 'undefined' && obj.duns !== null && obj.duns !== ''){
      oApiParam.oParam['duns'] = obj.duns;
    }

    if(typeof obj.applicant_type !== 'undefined' && obj.applicant_type !== null && obj.applicant_type !== ''){
      oApiParam.oParam['applicant_type'] = obj.applicant_type;
    }

    if(typeof obj.beneficiary_type !== 'undefined' && obj.beneficiary_type !== null && obj.beneficiary_type !== ''){
      oApiParam.oParam['beneficiary_type'] = obj.beneficiary_type;
    }

    if(typeof obj.assistance_type !== 'undefined' && obj.assistance_type !== null && obj.assistance_type !== ''){
      oApiParam.oParam['assistance_type'] = obj.assistance_type;
    }

    if(typeof obj.entity_type !== 'undefined' && obj.entity_type !== null && obj.entity_type.length == 1 && (obj.entity_type.indexOf('ent') > -1 || obj.entity_type.indexOf('ex') > -1)) {
      oApiParam.oParam['index'] = obj.entity_type.join(',');
    }

    if(typeof obj.sort !== 'undefined' && obj.sort !== null && obj.sort !== ''){
      oApiParam.oParam['sort'] = obj.sort;
    }
    //notice_type
    if(typeof obj.notice_type !== 'undefined' && obj.notice_type !== null && obj.notice_type !== '') {
      oApiParam.oParam['notice_type'] = obj.notice_type;
    }

    if(typeof obj.set_aside !== 'undefined' && obj.set_aside !== null && obj.set_aside !== '') {
      oApiParam.oParam['set_aside'] = obj.set_aside;
    }

    if(typeof obj['publish_date'] !== undefined && obj['publish_date'] !== null && obj['publish_date'] !== ''){
      oApiParam.oParam['publish_date'] = obj['publish_date'];
    }

    if(typeof obj['publish_date.from'] !== undefined && obj['publish_date.from'] !== null && obj['publish_date.from'] !== ''){
      oApiParam.oParam['publish_date.from'] = obj['publish_date.from'];
    }

    if(typeof obj['publish_date.to'] !== undefined && obj['publish_date.to'] !== null && obj['publish_date.to'] !== ''){
      oApiParam.oParam['publish_date.to'] = obj['publish_date.to'];
    }

    if(typeof obj['modified_date'] !== undefined && obj['modified_date'] !== null && obj['modified_date'] !== ''){
      oApiParam.oParam['modified_date'] = obj['modified_date'];
    }

    if(typeof obj['modified_date.from'] !== undefined && obj['modified_date.from'] !== null && obj['modified_date.from'] !== ''){
      oApiParam.oParam['modified_date.from'] = obj['modified_date.from'];
    }

    if(typeof obj['modified_date.to'] !== undefined && obj['modified_date.to'] !== null && obj['modified_date.to'] !== ''){
      oApiParam.oParam['modified_date.to'] = obj['modified_date.to'];
    }

    if(typeof obj['response_date'] !== undefined && obj['response_date'] !== null && obj['response_date'] !== ''){
      oApiParam.oParam['response_date'] = obj['response_date'];
    }

    if(typeof obj['response_date.from'] !== undefined && obj['response_date.from'] !== null && obj['response_date.from'] !== ''){
      oApiParam.oParam['response_date.from'] = obj['response_date.from'];
    }

    if(typeof obj['response_date.to'] !== undefined && obj['response_date.to'] !== null && obj['response_date.to'] !== ''){
      oApiParam.oParam['response_date.to'] = obj['response_date.to'];
    }

    if(typeof obj['signed_date'] !== undefined && obj['signed_date'] !== null && obj['signed_date'] !== ''){
      oApiParam.oParam['signed_date'] = obj['signed_date'];
    }

    if(typeof obj['signed_date.from'] !== undefined && obj['signed_date.from'] !== null && obj['signed_date.from'] !== ''){
      oApiParam.oParam['signed_date.from'] = obj['signed_date.from'];
    }

    if(typeof obj['signed_date.to'] !== undefined && obj['signed_date.to'] !== null && obj['signed_date.to'] !== ''){
      oApiParam.oParam['signed_date.to'] = obj['signed_date.to'];
    }

    //Cba No filter
    if(typeof obj['cba_no'] !== undefined && obj['cba_no'] !== null && obj['cba_no'] !== ''){
      oApiParam.oParam['cba_no'] = obj['cba_no'];
      delete oApiParam.oParam['is_standard'];
    }

    //showRegionalOffices only when
    if(obj.showRO) {
      oApiParam.oParam['q'] = obj.ro_keyword;
      oApiParam.oParam['index'] = 'ro';
      oApiParam.oParam['sort'] = '-relevance';
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
