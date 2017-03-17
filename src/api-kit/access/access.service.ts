import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccessInterface, UserAccessWrapper } from './access.interface';
import * as _ from 'lodash';
import { IDomain } from "./domain.interface";
import { IRole } from "./role.interface";

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
      oParam: {fetchNames: 'true'}
    };

    if (filterOptions) {
      if (filterOptions.domainIds && filterOptions.domainIds.length) {
        apiOptions.oParam.domainKey = filterOptions.domainIds.join(',');
      }

      if (filterOptions.functionIds && filterOptions.functionIds.length) {
        apiOptions.oParam.functionKey = filterOptions.functionIds.join(',');
      }

      if (filterOptions.roleIds && filterOptions.roleIds.length) {
        apiOptions.oParam.roleKey = filterOptions.roleIds.join(',');
      }

      if (filterOptions.organizationIds && filterOptions.organizationIds.length) {
        apiOptions.oParam.orgKey = filterOptions.organizationIds.join(',');
      }

      if (filterOptions.permissionIds && filterOptions.permissionIds.length) {
        apiOptions.oParam.permissionKey = filterOptions.permissionIds.join(',');
      }
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
      apiOptions.suffix = '/'+userName;
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

  postAccess(access: UserAccessWrapper, userName) {
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userName + '/',
      method: 'POST',
      body: access
    };

    return this.apiService.call(apiOptions, false);
  }
}
