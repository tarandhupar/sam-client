import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccessInterface, UserAccessWrapper } from './access.interface';
import { merge } from 'lodash';
import { IDomain } from "./domain.interface";
import { IRole } from "./role.interface";
import { IPermissions } from "./permissions.interface";
import { IFunction } from "./function.interface";
import { Cookie } from "ng2-cookies";
import { ActivatedRoute, Router } from "@angular/router";
import { QueryEncoder } from "@angular/http";

// In order to support '+' in query params...
class EmailAddressQueryEncoder extends QueryEncoder {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
}

export interface UserAccessFilterOptions {
  domainIds?: (string|number)[],
  organizationIds?: (string|number)[],
  functionIds?: (string|number)[],
  roleIds?: (string|number)[],
  permissionIds?: (string|number)[],
}

@Injectable()
export class UserAccessService {
  constructor(private apiService: WrapperService, private router: Router, private route: ActivatedRoute) {}

  callApi(oApiParam: any, convertToJSON: boolean = true, queryEncoder: QueryEncoder = null) {
    this.addAuthHeader(oApiParam);
    return this.apiService
      .call(oApiParam, convertToJSON, queryEncoder)
      .catch(res => {
        if (res && res.status === 401) {
          if (!this.router.url.match(/\/workspace/i)) {
            let options = {
              queryParams: merge({
                redirect: this.router.url.replace(/\?.+$/, '')
              }, this.route.snapshot.queryParams)
            };

            this.router.navigate(['/signin'], options);
          }
        }
        // This seems risky... I don't want to redirect unless I'm sure they are forbidden
        if (res && res.status === 403) {
          if (!this.router.url.match(/\/workspace/i)) {
            this.router.navigate(['/403']);
          }
        }
        return Observable.throw(res);
      });
  }

  addAuthHeader(options) {
    let superToken = Cookie.get('superToken');
    let iPlanetCookie = Cookie.get('iPlanetDirectoryPro');

    if (iPlanetCookie) {
      Cookie.delete('superToken');
    }

    if (!iPlanetCookie && !superToken) {
      return;
    }
    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie || '***'+superToken;
  }

  getAccess(userId: string, filterOptions?: any, toJson?: boolean) {
    toJson = toJson || false;

    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userId + '/',
      method: 'GET',
      oParam: { fetchNames: 'true'}
    };

    if (filterOptions) {
      apiOptions.oParam = merge(apiOptions.oParam, filterOptions);
    }

    return this.callApi(apiOptions, toJson);
  }

  getDomains(): Observable< IDomain > {
    let apiOptions: any = {
      name: 'rms',
      method: 'GET',
      suffix: '/domains/',
    };

    this.addAuthHeader(apiOptions);
    return this.callApi(apiOptions);
  }

  getPermissions() : Observable<IPermissions> {
    let apiOptions: any = {
      name: 'permissions',
      method: 'GET',
      suffix: '',
    };

    return this.callApi(apiOptions);
  }

  getFunctionById(id: number) : Observable<IFunction> {
    let apiOptions: any = {
      name: 'functions',
      method: 'GET',
      suffix: '/'+id+'/',
    };
    return this.callApi(apiOptions);
  }

  // Deprecated but functional as of today
  postAccessDeprecated(body: any, userName?, queryParams = {}) {
    let suffix = userName ? '/access/' + userName + '/' : '/access/';
    let apiOptions: any = {
      name: 'rms',
      suffix: suffix,
      method: 'POST',
      body: body,
      oParam: queryParams
    };

    return this.callApi(apiOptions, false);
  }

  postAccess(body: any, queryParams = {}) {
    let suffix = '/access';
    let apiOptions: any = {
      name: 'rms',
      suffix: suffix,
      method: 'POST',
      body: body,
      oParam: queryParams,
    };

    return this.callApi(apiOptions, false);
  }

  putAccess(body: any) {
    let suffix = '/access';
    let apiOptions: any = {
      name: 'rms',
      suffix: suffix,
      method: 'PUT',
      body: body,
      oParam: {}
    };

    return this.callApi(apiOptions, false);
  }

  deleteAccess(body: any) {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/access',
      method: 'DELETE',
      body: body,
      oParam: {},
    };
    return this.callApi(apiOptions, false);
  }

  postDomain(domain){
    let apiOptions : any = {
      name : 'rms',
      suffix: '/domains/',
      method: 'POST',
      body: domain
    };

    return this.callApi(apiOptions,false);
  }

  getDomainDefinition(mode : string, domainKey? : string, roleKey?, orgKey?: string, userName?) {
    let apiOptions: any = {
      name: 'domainDefinition',
      suffix: '/',
      method: 'GET',
      oParam: { }
    };

    if (mode) {
      apiOptions.oParam.mode = mode;
    }

    if( domainKey && domainKey.length > 0 ){
      apiOptions.oParam.domainKey = domainKey;
    }

    if (roleKey) {
      apiOptions.oParam.roleKey = ''+roleKey;
    }

    if (orgKey) {
      apiOptions.oParam.orgKey = ''+orgKey;
    }

    if (userName) {
      apiOptions.oParam.user = userName;
    }

    return this.callApi(apiOptions, true, new EmailAddressQueryEncoder());
  }

  createObject(domainId: number, objectName: number|string, permissions: {id?: any, val?: string}[], objectId: any) {
    let apiOptions: any = {
      name: 'domainDefinition',
      suffix: '/',
      method: 'POST',
      oParam: {}
    };

    let fun = { };

    if (objectId) {
      fun['id'] = objectId;
    }

    if (objectName) {
      fun['val'] = objectName;
    }

    apiOptions.body = {
      domain: {
        id: domainId
      },
      functionMapContent: [
        {
          function: fun,
          permission: permissions
        }
      ],

    };

    return this.callApi(apiOptions, false);
  }

  requestAccess(req: any, userName?) {
    let apiOptions: any = {
      name: 'requestaccess',
      suffix: '/',
      method: 'POST',
      body: req
    };

    return this.callApi(apiOptions, false);
  }

  putRole(obj) {
    let apiOptions: any = {
      name: 'domainDefinition',
      suffix: '/',
      method: 'POST',
      oParam: { },
      body: obj,
    };

    return this.callApi(apiOptions, false);
  }

  deleteFunction(domainKey : string , functionId: string){
    let apiOptions: any = {
      name: 'functions',
      suffix: '/' + functionId + '/',
      method: 'Delete',
      oParam: {}
    };
    apiOptions.oParam.domainKey = domainKey;

    return this.callApi(apiOptions, false);
  }

  getPendingRequests(userId: string, queryParams = {}) {
    let apiOptions: any = {
      name: 'requestaccess',
      suffix: '/',
      method: 'GET',
      oParam: queryParams
    };

    apiOptions.oParam.user = userId;

    return this.callApi(apiOptions, false, new EmailAddressQueryEncoder()).map(res => {
      if (res.status === 204) {
        return [];
      } else {
        return res.json().userAccessRequestList;
      }
    });
  }

  getPendingRequestById(requestId: any) {
    let apiOptions: any = {
      name: 'requestaccess',
      suffix: '/'+requestId+'/',
      method: 'GET',
      oParam: { }
    };

    return this.callApi(apiOptions);
  }

  getAccessStatus(view : string){
    let apiOptions : any = {
      name: 'rms',
      suffix: '/accessstatus/',
      method: 'GET',
      oParam: {}
    };
    apiOptions.oParam.view = view;

    return this.callApi(apiOptions);
  }

  getRequestStatuses() {
    let apiOptions: any = {
      name: 'accessstatus',
      suffix: '/',
      method: 'GET',
      oParam: {},
    };

    return this.callApi(apiOptions);
  }

  updateRequest(requestId: string, updatedRequest: any) {
    let apiOptions: any = {
      name: 'requestaccess',
      suffix: '/' + requestId + '/',
      method: 'PUT',
      oParam: {},
      body: updatedRequest,
    };

    return this.callApi(apiOptions, false);
  }

  getAllRoles() {
    let apiOptions : any = {
      name : 'rms',
      suffix : '/roles/',
      method : 'GET',
      oParam : {},
    };

    return this.callApi(apiOptions);
  }

  getRequestorIds(){
    let apiOptions : any = {
      name : 'rms',
      suffix : '/autocomplete/requestorids/',
      method : 'GET',
      oParam : {},
    };

    return this.callApi(apiOptions);
  }

  getRequestAccess(username : string, statusKey : string, domainKey : string, order : string, page : number ){
    let apiOptions : any = {
      name : 'rms',
      suffix : '/requestaccess/',
      method : 'GET',
      oParam: {},
    };

    if(statusKey.length > 0){
      apiOptions.oParam.statusKey = statusKey;
    }

    if(domainKey.length > 0){
      apiOptions.oParam.domainKey = domainKey;
    }

    if (username.length) {
      apiOptions.oParam.user = username;
    }

    apiOptions.oParam.order = order;
    apiOptions.oParam.page = page;

    return this.callApi(apiOptions, true, new EmailAddressQueryEncoder());
  }

  // Get an array of users and show the access and show the Org, domains for that org, and roles for that domains
  getUserDirectory(filterOptions = {}) {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/userdirectory/',
      method: 'GET',
      oParam: { }
    };

    if (filterOptions) {
      apiOptions.oParam = merge(apiOptions.oParam, filterOptions);
    }

    return this.callApi(apiOptions, true, new EmailAddressQueryEncoder());
  }

  getAllUserRoles(uid, queryParams = {}) {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/userprofile/'+uid+'/',
      method: 'GET',
      oParam: queryParams,
    };
    return this.callApi(apiOptions);
  }

  // used to determine admin level of logged in user
  getWidget() {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/widget/',
      method: 'GET',
      oParam: {}
    };

    return this.callApi(apiOptions);
  }

  // used to determine admin level of logged in user
  getAdminLevel() {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/checkaccess/',
      method: 'GET',
      oParam: {}
    };

    return this.callApi(apiOptions);
  }

  // used to determine whether the logged in user
  checkAccess(pageName: string, userId:string = '', requestId:string = '') {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/checkaccess/',
      method: 'GET',
      oParam: {
        pageName: pageName
      }
    };

    if(pageName.includes('users') && userId != null && userId !== '') {
      apiOptions.oParam.userId = userId;
    }
    if(pageName.includes('requests') && requestId != null && requestId !== '') apiOptions.oParam.requestId = requestId;

    return this.callApi(apiOptions, false, new EmailAddressQueryEncoder());
  }

  getDomainCategoriesAndRoles() {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/requestaccess/roles/',
      method: 'GET',
      oParam: {}
    };

    return this.callApi(apiOptions);
  }

  getUsers(queryParams = {}) {
    let apiOptions: any = {
      name: 'rms2',
      suffix: '/users/',
      method: 'GET',
      oParam: queryParams,
    };

    return this.callApi(apiOptions);
  }

  getUsersV1(queryParams = {}, orgs = []) {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/users/',
      method: 'POST',
      oParam: queryParams,
      body: orgs
    };

    return this.callApi(apiOptions);
  }

  findUsers(queryParams = {}) {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/users/',
      method: 'GET',
      oParam: queryParams
    };

    return this.callApi(apiOptions);
  }

  getOpenRequests(userId: string){
    let apiOptions: any = {
      name: 'rms',
      suffix: '/openrequests/',
      method: 'GET',
      oParam: {}
    };

    apiOptions.oParam.user = userId;

    return this.callApi(apiOptions, true, new EmailAddressQueryEncoder());
  }

  getUserAutoComplete(query : string, isGov: boolean = true, page: number = 1, limit = AUTOCOMPLETE_RECORD_PER_PAGE,
                      isDefaultOrg: boolean = false, isAssignableOrg: boolean = false){
    let apiOptions: any = {
      name: 'rms',
      suffix: '/autocomplete/',
      method: 'GET',
      oParam: {}
    };

    apiOptions.oParam.query = query;
    apiOptions.oParam.isGov = isGov;
    apiOptions.oParam.isDefaultOrg = isDefaultOrg;
    apiOptions.oParam.isAssignedOrgs = isAssignableOrg;


    if(!isGov) {
      apiOptions.oParam.limit = +limit;
      apiOptions.oParam.page = page;
    }
    return this.callApi(apiOptions);
  }

  getEntityAutoComplete(query : string, isGov: boolean = true, page: number = 1, limit = AUTOCOMPLETE_RECORD_PER_PAGE,
                      isDefaultOrg: boolean = false, isAssignableOrg: boolean = false){
    let apiOptions: any = {
      name: 'rms',
      suffix: '/autocomplete/entity',
      method: 'GET',
      oParam: {}
    };

    apiOptions.oParam.query = query;
    apiOptions.oParam.isGov = isGov;
    apiOptions.oParam.isDefaultOrg = isDefaultOrg;
    apiOptions.oParam.isAssignedOrgs = isAssignableOrg;


    if(!isGov) {
      apiOptions.oParam.limit = +limit;
      apiOptions.oParam.page = page;
    }
    return isDefaultOrg? this.callApi(apiOptions): this.apiService.call(apiOptions);
  }

  getEntityById(entityId){
    let apiOptions: any = {
      name: 'rms',
      suffix: '/autocomplete/entity/' + entityId,
      method: 'GET',
      oParam: {}
    };

    return this.callApi(apiOptions);
  }

  postRequestComment(requestId, message) {
    let suffix = `/requestaccess/${requestId}/comments/`;
    let apiOptions: any = {
      name: 'rms',
      suffix: suffix,
      method: 'POST',
      body: {
        content: message
      }
    };

    return this.callApi(apiOptions);
  }
}
