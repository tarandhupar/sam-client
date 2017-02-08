import { UserAccess, UserDomain, UserRole, UserOrganization, UserFunction } from "../../api-kit/user/user.interface";
import * as _ from 'lodash';

export class UserAccessModel {
  private _raw: UserAccess;

  private constructor() {  }

  static FromResponse(res: UserAccess): UserAccessModel {
    let a = new UserAccessModel();
    a._raw = res;
    return a;
  }

  public raw(): UserAccess {
    return this._raw;
  }

  public userName(): string {
    return this._raw.user;
  }

  public allOrganizations() {
    let ret = [];

    if (!this._raw.roleMapContent.length) {
      return [];
    }

    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domain => domain.organizationContent && domain.organizationContent.orgKey)
          .forEach(domain => {
            ret.push(domain.organizationContent.orgKey);
          });
      });
    return _.uniq(ret);
  }

  public allRoles() {
    if (!this._raw.roleMapContent || !this._raw.roleMapContent.length) {
      return [];
    }

    let ret = {};
    this._raw.roleMapContent.forEach(role => {
      if (role.role) {
        ret[role.role] = true;
      }
    });
    return Object.keys(ret);
  }

  public allDomains() {
    let ret = [];

    if (!this._raw.roleMapContent.length) {
      return [];
    }

    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domain => domain.organizationContent && domain.organizationContent.orgKey)
          .forEach(domain => {
            ret.push(domain.domain);
          });
      });
    return _.uniq(ret);
  }

  // a.k.a functions
  public allObjects() {
    let ret = [];

    if (!this._raw.roleMapContent.length) {
      return [];
    }

    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domain => domain.organizationContent && domain.organizationContent.FunctionContent && domain.organizationContent.FunctionContent.length)
          .forEach(domain => {
            domain.organizationContent.FunctionContent
              .filter(func => typeof func.function === 'number')
              .forEach(func => {
                ret.push(func.function);
              });
          });
      });
    return _.uniq(ret);
  }

  public allPermissions() {
    let ret = [];

    if (!this._raw.roleMapContent.length) {
      return [];
    }

    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domain => domain.organizationContent && domain.organizationContent.FunctionContent && domain.organizationContent.FunctionContent.length)
          .forEach(domain => {
            domain.organizationContent.FunctionContent
              .filter(func => func.permission && func.permission.length)
              .forEach(func => {
                func.permission.forEach(perm => ret.push(perm));
              });
          });
      });
    return _.uniq(ret);
  }

}
