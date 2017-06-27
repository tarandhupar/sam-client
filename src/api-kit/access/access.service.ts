import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccessInterface, UserAccessWrapper } from './access.interface';
import * as _ from 'lodash';
import { IDomain } from "./domain.interface";
import { IRole } from "./role.interface";
import { IPermissions } from "./permissions.interface";
import { IFunction } from "./function.interface";
import { Cookie } from "ng2-cookies";
import { Router } from "@angular/router";

export interface UserAccessFilterOptions {
  domainIds?: (string|number)[],
  organizationIds?: (string|number)[],
  functionIds?: (string|number)[],
  roleIds?: (string|number)[],
  permissionIds?: (string|number)[],
}

@Injectable()
export class UserAccessService {

  constructor(private apiService: WrapperService, private router: Router) {

  }

  callApi(oApiParam: any, convertToJSON: boolean = true) {
    this.addAuthHeader(oApiParam);
    return this.apiService
      .call(oApiParam, convertToJSON)
      .catch(res => {
        if (res.status === 401 || res.status === 403) {
          this.router.navigate(['/signin']);
        }
        return Observable.throw(res);
      });
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
      apiOptions.oParam = _.merge(apiOptions.oParam, filterOptions);
    }

    return this.callApi(apiOptions, toJson);
  }

  getRoles(queryParams, userName?, adminLevel?: number): Observable< Array<IRole> > {
    let apiOptions: any = {
      name: 'uiroles',
      method: 'GET',
      suffix: '',
      oParam: {
        fetchNames: 'true',
      }
    };

    if (userName) {
      apiOptions.suffix = '/'+userName+'/';
    }

    if (typeof adminLevel === 'number') {
      apiOptions.oParam.adminLevel = adminLevel;
    }

    apiOptions.oParam = _.merge(apiOptions.oParam, queryParams);
    return this.callApi(apiOptions);
  }

  getDomains(): Observable< IDomain > {
    let apiOptions: any = {
      name: 'domains',
      method: 'GET',
      suffix: '',
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

  postAccess(access: UserAccessWrapper, userName, queryParams = {}) {
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userName + '/',
      method: 'POST',
      body: access,
      oParam: queryParams
    };

    return this.callApi(apiOptions, false);
  }

  postDomain(domain){
    let apiOptions : any = {
      name : 'domains',
      suffix: '/',
      method: 'POST',
      body: domain
    };

    return this.callApi(apiOptions,false);
  }

  getRoleObjDefinitions(mode : string, domainKey : string, roleKey?) {
    let apiOptions: any = {
      name: 'domainDefinition',
      suffix: '/',
      method: 'GET',
      oParam: { }
    };

    if (mode) {
      apiOptions.oParam.mode = mode;
    }

    if( domainKey.length > 0 ){
      apiOptions.oParam.domainKey = domainKey;
    }

    if (roleKey) {
      apiOptions.oParam.roleKey = ''+roleKey;
    }

    // API umbrella ain't ready for this
    //this.addAuthHeader(apiOptions);

    return this.callApi(apiOptions);
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

  requestAccess(req: any, userName) {
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

    return this.callApi(apiOptions, false).map(res => {
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

    return this.callApi(apiOptions);
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
      apiOptions.oParam = _.merge(apiOptions.oParam, filterOptions);
    }

    return this.callApi(apiOptions);
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

  getUserRoleDetails(userId: string, queryParams: any) {
    let apiOptions: any = {
      name: 'rms',
      suffix: '/userprofile/'+userId+'/',
      method: 'GET',
      oParam: queryParams
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

  addAuthHeader(options) {
    let iPlanetCookie = Cookie.getAll().iPlanetDirectoryPro;

    if (!iPlanetCookie) {
      return;
    }

    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie;
  }
}
