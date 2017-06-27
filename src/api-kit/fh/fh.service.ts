import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { FHWrapperService} from './fhWrapper.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';
import { Cookie } from "ng2-cookies";
import { Router } from "@angular/router";

@Injectable()
export class FHService {

  constructor(private oAPIService: WrapperService, private fhAPIService: FHWrapperService, private _http: Http, private  router: Router) { }

  getOrganizations(queryParams = {}) {
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '',
      oParam: queryParams,
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets organization with heirarchy data
  getOrganizationById(id: string, includeChildrenLevels: boolean, includeOrgTypes: boolean = false) {
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

    return this.oAPIService.call(oApiParam);
  }

  getOrganizationLogo(organizationAPI: Observable<any>, cbSuccessFn: any, cbErrorFn: any) {
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

  getDepartments() {
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '/departments/',
      method: 'GET'
    };
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
    return this.oAPIService.call(oApiParam);
  }

  getDepartmentAdminLanding(status:string, orgId:string){
    let oApiParam = {
      name: 'federalHierarchyActive',
      suffix: '/hierarchy/'+orgId,
      method: 'GET',
      oParam: {type:'agency'}
    };
    if(status !== 'active') oApiParam.oParam['status'] = status;
    return this.oAPIService.call(oApiParam);
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
    return this.fhAPIService.call(apiOptions);

  }

  fhSearch(q:string, pageNum, pageSize, status, orgType){
    let apiOptions: any = {
      name: 'fh',
      suffix: '/search',
      method: 'GET',
      oParam: {
        'q':q,
        'pageNum':pageNum,
        'pageSize':pageSize,
        'orderBy': 'orgKey',
        'ascending': 'asc',
      }
    };
    if(status.length === 1) apiOptions.oParam['status']= status[0];
    if(orgType.length > 0) {
      apiOptions.oParam['exclusive']= true;
      apiOptions.oParam['depth']= orgType[0];
    }
    return this.oAPIService.call(apiOptions);
  }

  fhSearchCount(q:string, searchType, status, orgType){
    let apiOptions: any = {
      name: 'fh',
      suffix: '/search/count',
      method: 'GET',
      oParam: {
        'q':q,
        'searchType':searchType,
      }
    };
    if(status.length === 1) apiOptions.oParam['status']= status[0];
    if(orgType.length > 0) {
      apiOptions.oParam['exclusive']= true;
      apiOptions.oParam['depth']= orgType[0];
    }
    return this.oAPIService.call(apiOptions);
  }

  getMyOrganization(orgKey, orgType){
    if(orgType[0] === '2' || orgType.length === 0){
      return this.getOrganizationById(orgKey, true);
    }else {
      return Observable.of({});
    }
  }

  addAuthHeader(options) {
    let iPlanetCookie = Cookie.getAll().iPlanetDirectoryPro;

    if (!iPlanetCookie) {
      return;
    }

    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie;
  }

  callApi(oApiParam: any, convertToJSON: boolean = true) {
    this.addAuthHeader(oApiParam);
    return this.oAPIService
      .call(oApiParam, convertToJSON)
      .catch(res => {
        if (res.status === 401 || res.status === 403) {
          this.router.navigate(['/signin']);
        }
        return Observable.throw(res);
      });
  }

}
