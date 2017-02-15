import { UserAccess } from "api-kit/user/user.interface";

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
    if (!this._raw.roleMapContent.length) {
      return [];
    }

    let orgs = new Set();

    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domainOrgEmail => domainOrgEmail.organizationMapContent && domainOrgEmail.organizationMapContent.orgKey && domainOrgEmail.organizationMapContent.orgKey.length)
          .forEach(domainOrgEmail => {
            let id = domainOrgEmail.organizationMapContent.orgKey.trim();
            if (!orgs.has(id)) {
              orgs.add(id);
            }
          });
      });
    return Array.from(orgs.keys());
  }

  public allRoles() {
    if (!this._raw.roleMapContent || !this._raw.roleMapContent.length) {
      return [];
    }
    return this._raw.roleMapContent.map(role => role.role);
  }

  public allDomains() {
    if (!this._raw.roleMapContent.length) {
      return [];
    }

    let domains = new Map();

    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domainOrgEmail => domainOrgEmail.organizationMapContent && domainOrgEmail.organizationMapContent.orgKey)
          .forEach(domainOrgEmail => {
            let id = domainOrgEmail.domain.id;
            if (!domains.has(id)) {
              let domain = domainOrgEmail.domain;
              domains.set(id, domain);
            }
          });
      });
    return Array.from(domains.values());
  }

  // a.k.a functions
  public allObjects() {
    if (!this._raw.roleMapContent.length) {
      return [];
    }

    let objects = new Map();
    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domainOrgEmail => domainOrgEmail.organizationMapContent && domainOrgEmail.organizationMapContent.functionMapContent && domainOrgEmail.organizationMapContent.functionMapContent.length)
          .forEach(domainOrgEmail => {
            domainOrgEmail.organizationMapContent.functionMapContent
              .filter(func => func.function)
              .forEach(func => {
                let id = func.function.id;
                if (!objects.has(id)) {
                  objects.set(id, func.function);
                }
              });
          });
      });
    return Array.from(objects.values());
  }

  public allPermissions() {
    let ret = [];

    if (!this.hasRoleMapContent()) {
      return [];
    }

    let permissions = new Map();
    this._raw.roleMapContent
      .filter(role => role.roleData && role.roleData.length)
      .forEach(role => {
        role.roleData
          .filter(domain => domain.organizationMapContent && domain.organizationMapContent.functionMapContent && domain.organizationMapContent.functionMapContent.length)
          .forEach(domain => {
            domain.organizationMapContent.functionMapContent
              .filter(func => func.permission && func.permission.length)
              .forEach(func => {
                func.permission.forEach(perm => {
                  if (!permissions.has(perm)) {
                    permissions.set(perm.id, perm);
                  }
                });
              });
          });
      });
    return Array.from(permissions.values());
  }

  private hasRoleMapContent() {
    return this._raw.roleMapContent && this._raw.roleMapContent.length;
  }

}
