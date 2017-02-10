import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccess } from './user.interface';

export interface UserAccessFilterOptions {
  domainIds?: (string|number)[],
  organizationIds?: (string|number)[],
  functionIds?: (string|number)[],
  roleIds?: (string|number)[],
  permissionIds?: (string|number)[],
}

@Injectable()
export class UserService {

  constructor(private apiService: WrapperService) {

  }

  getAccess(userId: string, filterOptions?: UserAccessFilterOptions): Observable<UserAccess> {
    if (typeof userId === 'undefined') {
      throw new Error('userId is required');
    }
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userId + '/',
      method: 'GET',
      oParam: { }
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
        apiOptions.oParam.permKey = filterOptions.permissionIds.join(',');
      }
    }

    return this.apiService.call(apiOptions);
  }
}
