import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccessInterface, UserAccessWrapper } from './access.interface';
import * as _ from 'lodash';
import { IDomain } from "./domain.interface";
import { IRole } from "./role.interface";
import { IPermissions } from "./permissions.interface";
import { IFunction } from "./function.interface";

export interface UserAccessFilterOptions {
  domainIds?: (string|number)[],
  organizationIds?: (string|number)[],
  functionIds?: (string|number)[],
  roleIds?: (string|number)[],
  permissionIds?: (string|number)[],
}

@Injectable()
export class UserAccessService {

  constructor(private apiService: WrapperService) {

  }

  getAccess(userId: string, filterOptions?: any): Observable<UserAccessInterface> {
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userId + '/',
      method: 'GET',
      oParam: { fetchNames: 'true'}
    };

    if (filterOptions) {
      apiOptions.oParam = _.merge(apiOptions.oParam, filterOptions);
    }

    return this.apiService.call(apiOptions);
  }

  getRoles(queryParams, userName?): Observable< Array<IRole> > {
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

    apiOptions.oParam = _.merge(apiOptions.oParam, queryParams);
    return this.apiService.call(apiOptions);
  }

  getDomains(): Observable< IDomain > {
    let apiOptions: any = {
      name: 'domains',
      method: 'GET',
      suffix: '',
    };

    return this.apiService.call(apiOptions);
  }

  getPermissions() : Observable<IPermissions> {
    let apiOptions: any = {
      name: 'permissions',
      method: 'GET',
      suffix: '',
    };

    return this.apiService.call(apiOptions);
  }

  getFunctionById(id: number) : Observable<IFunction> {
    let apiOptions: any = {
      name: 'functions',
      method: 'GET',
      suffix: '/'+id+'/',
    };
    return this.apiService.call(apiOptions);
  }

  postAccess(access: UserAccessWrapper, userName) {
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userName + '/',
      method: 'POST',
      body: access
    };

    return this.apiService.call(apiOptions, false);
  }

  postDomain(domain){
    let apiOptions : any = {
      name : 'domains',
      suffix: '/',
      method: 'POST',
      body: domain
    };

    return this.apiService.call(apiOptions,false);
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

    return this.apiService.call(apiOptions);
  }

  createObject(domainId: number, objectName: number|string, permissions: {id?: any, val?: string}[], objectId: any) {
    console.log(arguments);
    let apiOptions: any = {
      name: 'domainDefinition',
      suffix: '/',
      method: 'POST',
      oParam: {}
    };

    let fun = { }

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

    console.log(apiOptions.body);

    return this.apiService.call(apiOptions, false);
  }

  requestAccess(req: any, userName) {
    let apiOptions: any = {
      name: 'requestaccess',
      suffix: '/' + userName + '/',
      method: 'POST',
      body: req
    };

    return this.apiService.call(apiOptions, false);
  }

  putRole(obj) {
    let apiOptions: any = {
      name: 'domainDefinition',
      suffix: '/',
      method: 'POST',
      oParam: { },
      body: obj,
    };

    return this.apiService.call(apiOptions, false);
  }

  deleteFunction(domainKey : string , functionId: string){
    let apiOptions: any = {
      name: 'functions',
      suffix: '/' + functionId + '/',
      method: 'Delete',
      oParam: {}
    };
    apiOptions.oParam.domainKey = domainKey;

    return this.apiService.call(apiOptions, false);
  }

  getAccessStatus(view : string){
    let apiOptions : any = {
      name: 'rms',
      suffix: '/accessstatus/',
      method: 'GET',
      oParam: {}
    }
    apiOptions.oParam.view = view;

    return this.apiService.call(apiOptions);
  }

}
