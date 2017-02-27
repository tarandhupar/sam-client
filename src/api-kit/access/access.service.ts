import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccessInterface } from './access.interface';
import {RoleInterface} from "./roles.interface";

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

  getAccess(userId: string, filterOptions?: UserAccessFilterOptions): Observable<UserAccessInterface> {
    if (typeof userId === 'undefined') {
      throw new Error('userId is required');
    }
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userId + '/',
      method: 'GET',
      oParam: { fetchNames: 'true' }
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

  getRoles(): Observable< Array<RoleInterface> > {
    let apiOptions: any = {
      name: 'roles',
      method: 'GET',
      suffix: '',
    };

    return this.apiService.call(apiOptions);
  }

  getPermissions(roleId) {
    let apiOptions: any = {
      name: 'permissions',
      method: 'GET',
      suffix: '/'+roleId,
      oParam: {
        fetchNames: 'true',
        roleKey: roleId
      }
    };

    return this.apiService.call(apiOptions);
  }

  putAccess(access: UserAccessInterface) {
    if (!access.user) {
      throw new Error('access.user is required');
    }

    let apiOptions: any = {
      name: 'access',
      suffix: '/' + access.user + '/',
      method: 'PUT',
      body: access
    };

    return this.apiService.call(apiOptions);
  }
}
