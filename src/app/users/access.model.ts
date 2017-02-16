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
    let map = new Map();
    domains.forEach(dom => map.set(dom.id, dom));
    return Array.from(map.values());
  }

  // a.k.a functions
  public allObjects() {
    let objects = this.collector.collect(['roleMapContent', [], 'roleData', [], 'organizationMapContent', 'functionMapContent', [], 'function']);
    let map = new Map();
    objects.forEach(obj => map.set(obj.id, obj));
    return Array.from(map.values());
  }

  public allPermissions() {
    let perms = this.collector.collect(['roleMapContent', [], 'roleData', [], 'organizationMapContent', 'functionMapContent', [], 'permission', []]);
    let map = new Map();
    perms.forEach(perm => map.set(perm.id, perm));
    return Array.from(map.values());
  }

  private hasRoleMapContent() {
    return this._raw.roleMapContent && this._raw.roleMapContent.length;
  }

}
