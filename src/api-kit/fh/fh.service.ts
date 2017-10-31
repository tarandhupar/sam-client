import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { FHWrapperService} from './fhWrapper.service';
import 'rxjs/add/operator/map';
import { Observable,ReplaySubject } from 'rxjs';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';
import { Cookie } from "ng2-cookies";
import { Router, ActivatedRoute } from "@angular/router";

@Injectable()
export class FHService {

  constructor(
    private oAPIService: WrapperService,
    private fhAPIService: FHWrapperService,
    private _http: Http,
    private  router: Router,
    private route: ActivatedRoute,
  ) { }

  getOrganizations(queryParams = {}) {
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '',
      oParam: queryParams,
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }


  getAccess(orgKey:string, toJson?: boolean) {
    toJson = toJson || false;

    let apiOptions: any = {
      name: 'fh',
      suffix: '/admin/checkAccess',
      method: 'GET',
      oParam: {}
    };

    if(orgKey !== ""){
      apiOptions.oParam['orgKey'] = orgKey;
    }
    return this.callApi(apiOptions, toJson);
  }

  //gets organization with heirarchy data
  getOrganizationById(id: string, includeChildrenLevels: boolean, includeOrgTypes: boolean = false, status: string = 'all', pageSize: number = 10, pageNum: number = 1, orderBy: string = "asc", hasFPDS: boolean = false) {
    var oApiParam = {
        name: '',
        suffix: '',
        oParam: {},
        method: 'GET'
      };

    //organizationId length >= 30 -> call opportunity org End Point
    if (id.length >= 30) {
      oApiParam.name = 'opportunity';
      oApiParam.suffix = '/opportunities/' + id + '/organization';
    } else { //organizationId less than 30 character then call Octo's FH End point
      oApiParam.name = 'federalHierarchy';
      oApiParam.suffix = ((includeChildrenLevels) ? '/hierarchy/' : '/') + id;
      oApiParam.oParam = {
        'sort': 'name',
        'mode': 'slim'
      };
    }

    if (includeOrgTypes) {
      oApiParam.oParam['types'] = 'true';
    }

    if (status !== 'all') {
      oApiParam.oParam['status'] = status;
    }

    if (includeChildrenLevels) {
      oApiParam.oParam['limit'] = pageSize;
      oApiParam.oParam['offset'] = pageNum;
      oApiParam.oParam['order'] = orderBy;
    }

    if (hasFPDS) {
      oApiParam.oParam['has-fpds'] = 'true';
    }
    return this.oAPIService.call(oApiParam);
  }

  //gets organization with heirarchy data
  getFHOrganizationById(id: string, includeChildrenLevels: boolean, includeOrgTypes: boolean = false, status: string = 'all', pageSize: number = 10, pageNum: number = 1, orderBy: string = "asc", hasFPDS: boolean = false) {
    var oApiParam = {
      name: '',
      suffix: '',
      oParam: {},
      method: 'GET'
    };

    //organizationId length >= 30 -> call opportunity org End Point
    if (id.length >= 30) {
      oApiParam.name = 'contractOpportunity';
      oApiParam.suffix = '/opportunities/' + id + '/organization';
    } else { //organizationId less than 30 character then call Octo's FH End point
      oApiParam.name = 'federalHierarchy';
      oApiParam.suffix = ((includeChildrenLevels) ? '/hierarchy/' : '/') + id;
      oApiParam.oParam = {
        'sort': 'name',
        'mode': 'slim'
      };
    }

    if (includeOrgTypes) {
      oApiParam.oParam['types'] = 'true';
    }

    if (status !== 'all') {
      oApiParam.oParam['status'] = status;
    }

    if (includeChildrenLevels) {
      oApiParam.oParam['limit'] = pageSize;
      oApiParam.oParam['offset'] = pageNum;
      oApiParam.oParam['order'] = orderBy;
    }

    if (hasFPDS) {
      oApiParam.oParam['has-fpds'] = 'true';
    }
    return this.oAPIService.call(oApiParam);
  }

  getOrganizationsByIds(ids: string) {
    var oApiParam = {
      name: 'federalHierarchy',
      suffix: '',
      oParam: {
        'orgKey': ids,
        'sort': 'name',
        'mode': 'slim'
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  }

  getOrganizationDetail(id: string){
    var oApiParam = {
      name: 'fhDetail',
      suffix: '/organizations/'+id,
      oParam: {},
      method: 'GET'
    };

    return this.callApi(oApiParam, true);
  }

  getOrganizationLogo(organizationAPI: Observable<any>|ReplaySubject<any>, cbSuccessFn: any, cbErrorFn: any) {
    organizationAPI.subscribe(org => {
      // Do some basic null checks
      if(org == null || org['_embedded'] == null || org['_embedded'][0] == null) {
        cbSuccessFn(null);
        return;
      }

      //base when no logo for a department
      if(typeof org['_embedded'][0]['_link']['logo'] == 'undefined' && org['_embedded'][0]['org'] != null && typeof org['_embedded'][0]['org']['parentOrgKey'] == 'undefined') {
        cbSuccessFn(null);
        return;
      }

      // Base case: If logo exists, save it to a variable and exit
      if(org['_embedded'][0]['_link'] != null && org['_embedded'][0]['_link']['logo'] != null && org['_embedded'][0]['_link']['logo']['href'] != null) {
        let response = {};
        let data = org['_embedded'][0]['org'];
        response['logo'] = org['_embedded'][0]['_link']['logo']['href'];
        response['info'] = (data['agencyName'] || data['name'] || data['orgKey'] || 'Organization') + ' Logo';

        cbSuccessFn(response);
        return;
      }

      // Recursive case: If parent orgranization exists, recursively try to load its logo
      if(org['_embedded'][0]['org'] != null && org['_embedded'][0]['org']['parentOrgKey'] != null) {
        this.getOrganizationLogo(this.getOrganizationById(org['_embedded'][0]['org']['parentOrgKey'], false), cbSuccessFn, cbErrorFn);
      }
    }, err => {
      cbErrorFn(err);
    });
  }

  getDepartments(hasFPDS: boolean = false) {
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '/departments/',
      method: 'GET',
      oParam: {}
    };

    if (hasFPDS) {
      oApiParam.oParam['has-fpds'] = 'true';
    }
    return this.oAPIService.call(oApiParam);
  }

  getDepartmentsByStatus(status:string){
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '/activedepartment/',
      method: 'GET',
      oParam: {}
    };
    if(status !== 'active') oApiParam.oParam['status'] = status;
    return this.callApi(oApiParam, true);
  }

  getDepartmentAdminLanding(status:string){

    let oApiParam = {
      name: 'fh',
      suffix: '/myOrganizations',
      method: 'GET',
      oParam: {}
    };
    if(status !== 'active') oApiParam.oParam['status'] = status;
    return this.callApi(oApiParam, true);
  }

  search(oData) {
    let oApiParam = {
      name: 'search',
      suffix: '/',
      oParam: {
        index: "fh",
        q: oData.keyword
      },
      method: 'GET'
    };
    if (oData['pageNum']) {
      oApiParam.oParam['page'] = oData['pageNum'];
    }
    if (oData['pageSize']) {
      oApiParam.oParam['size'] = oData['pageSize'];
    }
    if (oData['parentOrganizationId']) {
      oApiParam.oParam['qFilters'] = {
        parentOrganizationId: oData['parentOrganizationId']
      };
    }
    return this.oAPIService.call(oApiParam);
  }

  updateOrganization(org, isMove:boolean = false) {
    let apiOptions: any = {
      name: 'fh',
      suffix: '/org',
      method: 'PUT',
      oParam: {},
      body: org
    };
    if(isMove) apiOptions.oParam['isMove'] = isMove;
    return this.callApi(apiOptions, false);
  }

  createOrganization(org, fullParentPath, fullParentPathName) {
    let apiOptions: any = {
      name: 'federalCreateOrg',
      suffix: '',
      method: 'POST',
      body: org,
      oParam: {}
    };
    if(org.type !== "DEPARTMENT"){
      apiOptions.oParam = {
        'fullparentpath': fullParentPath,
        'fullparentpathname': fullParentPathName
      }
    }
    return this.callApi(apiOptions, true);

  }


  fhSearch(q:string, pageNum, pageSize, status, levels, orgType, isCode = false, parent = null, isDefaultDept = false){
    let apiOptions: any = {
      name: 'fh',
      suffix: '/search',
      method: 'GET',
      oParam: {
        'q':q,
        'pageNum':pageNum,
        'pageSize':pageSize,
        'orderBy': 'level',
        'ascending': 'asc',
      }
    };
    if(status.length === 1) apiOptions.oParam['status']= status[0];
    if(orgType && orgType.length > 0) {
      apiOptions.oParam['orgType']= orgType.join(',');
    }
    if(isCode){
      apiOptions.oParam['searchType'] = "code";
    }
    if(parent){
      apiOptions.oParam['parent'] = parent;
    }
    if(isDefaultDept) {
      apiOptions.oParam['defaultDept'] = 'true';
    }
    return this.callApi(apiOptions, true);
  }

  fhSearchCount(q:string, searchType, status, levels, orgType, isCode = false, parent = null, isDefaultDept = false){
    let apiOptions: any = {
      name: 'fh',
      suffix: '/search/count',
      method: 'GET',
      oParam: {
        'q':q,
        'searchType':searchType,
        'defaultDept': isDefaultDept,
      }
    };
    if(status.length === 1) apiOptions.oParam['status']= status[0];
    if(orgType.length > 0) {
      apiOptions.oParam['orgType']= orgType.join(',');
    }
    if(isCode){
      apiOptions.oParam['searchType'] = "code";
    }
    if(parent){
      apiOptions.oParam['parent'] = parent;
    }

    return this.callApi(apiOptions, true);

  }

  getMyOrganization(orgKey, orgType){
    if(orgType[0] === '2' || orgType.length === 0){
      return this.getOrganizationById(orgKey, true);
    }else {
      return Observable.of({});
    }
  }

  getSearchFilterTypes(){
    let apiOptions: any = {
      name: 'federalHierarchy',
      suffix: '/type',
      method: 'GET',
      oParam: {}
    };

    return this.callApi(apiOptions,true);
  }

  getFHWidgetInfo(type, day){
    let apiOptions: any = {
      name: 'fhDetail',
      suffix: '/FHWidget',
      method: 'GET',
      oParam: {
        type: type,
        days: day
      }
    };

    return this.callApi(apiOptions,true);
  }

  requestAAC(orgId, isProcure:boolean){
    let apiOptions: any = {
      name: 'fhDetail',
      suffix: '/aac',
      method: 'POST',
      oParam: {
        nonproc: !isProcure,
        orgKey: orgId
      }
    };

    return this.callApi(apiOptions,true);
  }

  addAuthHeader(options) {
    let superToken = Cookie.get('superFHToken');
    let iPlanetCookie = Cookie.get('iPlanetDirectoryPro');

    if (iPlanetCookie) {
      Cookie.delete('superFHToken');
    }

    if (!iPlanetCookie && !superToken) {
      return;
    }
    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie || '***' + superToken;
  }

  callApi(oApiParam: any, convertToJSON: boolean = true) {
    this.addAuthHeader(oApiParam);
    return this.oAPIService
      .call(oApiParam, convertToJSON)
      .catch(res => {
        if (res.status === 401) {
          if (!this.router.url.match(/\/workspace/i)) {
            this.router.navigate(['/signin']);
          }
        }
        return Observable.throw(res);
      });
  }

}
