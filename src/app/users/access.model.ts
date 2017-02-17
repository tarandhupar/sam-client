import { UserAccess } from "api-kit/user/user.interface";
import { PropertyCollector } from "../app-utils/property-collector";
import * as _ from 'lodash';

export class UserAccessModel {
  private _raw: UserAccess;
  private collector: PropertyCollector;

  private constructor() {  }

  static FromResponse(res: UserAccess): UserAccessModel {
    let a = new UserAccessModel();
    a._raw = res;
    a.collector = new PropertyCollector(res);
    return a;
  }

  public raw(): UserAccess {
    return this._raw;
  }

  public userName(): string {
    return this._raw.user;
  }

  public allOrganizations() {
    let orgKeys = this.collector.collect(['roleMapContent', [], 'roleData', [], 'organizationMapContent', 'orgKey']);
    return _.uniq(orgKeys);
  }

  public allRoles() {
    if (!this._raw.roleMapContent || !this._raw.roleMapContent.length) {
      return [];
    }
    return this._raw.roleMapContent.map(role => role.role);
  }

  public allDomains() {
    let domains = this.collector.collect(['roleMapContent', [], 'roleData', [], 'domain']);
    return _.uniqBy(domains, dom => dom.id);
  }

  // a.k.a functions
  public allObjects() {
    let objects = this.collector.collect(['roleMapContent', [], 'roleData', [], 'organizationMapContent', 'functionMapContent', [], 'function']);
    return _.uniqBy(objects, obj => obj.id);
  }

  public allPermissions() {
    let perms = this.collector.collect(['roleMapContent', [], 'roleData', [], 'organizationMapContent', 'functionMapContent', [], 'permission', []]);
    return _.uniqBy(perms, perm => perm.id);
  }
}
