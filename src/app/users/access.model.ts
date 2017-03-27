import { UserAccessInterface, UserAccessWrapper } from "api-kit/access/access.interface";
import { PropertyCollector } from "../app-utils/property-collector";
import * as _ from 'lodash';

export interface FunctionInterface {
  id: string|number,
  permissions: Array<string|number>
}

export class UserAccessModel {
  private _raw: UserAccessInterface;
  private collector: PropertyCollector;

  private constructor() {  }

  static FromResponse(res: UserAccessInterface): UserAccessModel {
    let a = new UserAccessModel();
    a._raw = res;
    a.collector = new PropertyCollector(res);
    return a;
  }

  static CreateDeletePartial(user, roleId, domainId, orgIds): UserAccessWrapper {
    console.log(arguments);
    let organizationMapContent = [{
      organizations: orgIds,
    }];

    return {
      mode: "remove",
      existingAccessContent: {
        user: user,
        domainContent: [
          {
            domain: domainId,
            roleContent: [
              {
                role: roleId,
                organizationContent: organizationMapContent
              }
            ]
          }
        ]
      }
    };
  }

  static CreateEditObject(user, roleId, domainId, orgIds: any[], functions: Array<FunctionInterface>, messages: string, existingAccess): UserAccessWrapper {
    let functionMapContent = functions.map(fun => {
      return {
        function: fun.id,
        permission: fun.permissions,
      };
    }).filter(fun => {
      return !!fun.permission.length;
    });

    let organizationMapContent = [{
      organizations: orgIds,
      functionContent: functionMapContent
    }];

    let existingAcc = _.clone(existingAccess.raw());

    existingAcc.user = _.clone(existingAcc.id);
    delete existingAcc.id;

    // convert ID/Val pairs to just ids
    existingAcc.domainMapContent.forEach(dom => {
      let did = dom.domain.id;
      dom.domain = did;
      dom.roleMapContent.forEach( role => {
        let rid = role.role.id;
        role.role = rid;
        role.organizationMapContent.forEach(org => {
          org.functionMapContent.forEach(fun => {
            let fid = fun.function.id;
            fun.function = fid;
            fun.permission = fun.permission.map(perm => perm.id);
          });
          org.functionContent = _.clone(org.functionMapContent);
          delete org.functionMapContent;
        });
        role.organizationContent = _.clone(role.organizationMapContent);
        delete role.organizationMapContent;
      });
      dom.roleContent = _.clone(dom.roleMapContent);
      delete dom.roleMapContent;
    });
    existingAcc.domainContent = _.clone(existingAcc.domainMapContent);
    delete existingAcc.domainMapContent;
    console.log('after', existingAcc);

    return {
      message: messages,
      mode: "edit",
      existingAccessContent: existingAcc,
      updatedAccessContent: {
        user: user,
        domainContent: [
          {
            domain: domainId,
            roleContent: [
              {
                role: roleId,
                organizationContent: organizationMapContent
              }
            ]
          }
        ]
      }
    };
  }

  static CreateGrantObject(user, roleId, domainId, orgIds: any[], functions: Array<FunctionInterface>, messages: string): UserAccessWrapper {
    let functionMapContent = functions.map(fun => {
      return {
        function: fun.id,
        permission: fun.permissions,
      };
    }).filter(fun => {
      return !!fun.permission.length;
    });

    let organizationMapContent = [{
      organizations: orgIds,
      functionContent: functionMapContent
    }];

    return {
      message: messages,
      mode: "grant",
      updatedAccessContent: {
        user: user,
        domainContent: [
          {
            domain: domainId,
            roleContent: [
              {
                role: roleId,
                organizationContent: organizationMapContent
              }
            ]
          }
        ]
      }
    };
  }

  public raw(): UserAccessInterface {
    return this._raw;
  }

  public allOrganizations() {
    let orgKeys = this.collector.collect(['domainMapContent', [], 'roleMapContent', [], 'organizationMapContent', [], 'organizations', []]);
    return _.uniq(orgKeys);
  }

  public allRoles() {
    let roles = this.collector.collect(['domainMapContent', [], 'roleMapContent', [], 'role']);
    return _.uniqBy(roles, r => r.id);
  }

  public allDomains() {
    let domains = this.collector.collect(['domainMapContent', [], 'domain']);
    return _.uniqBy(domains, d => d.id);
  }

  // a.k.a functions
  public allObjects() {
    let objs = this.collector.collect(['domainMapContent', [], 'roleMapContent', [], 'organizationMapContent', [], 'functionMapContent', [], 'function']);
    return _.uniqBy(objs, o => o.id);
  }

  public allPermissions() {
    let objs = this.collector.collect(['domainMapContent', [], 'roleMapContent', [], 'organizationMapContent', [], 'functionMapContent', [], 'permission', []]);
    return _.uniqBy(objs, o => o.id);
  }

  private alertAdminPermissions(): any[] {
    let ret = [];

    this._raw.domainMapContent.forEach(domain => {
      if (!domain.domain || !domain.domain.val || domain.domain.val !== 'ADMIN') {
        return;
      }
      domain.roleMapContent.forEach(role => {
        if (!role.role || !role.role.val || role.role.val !== 'SUPERUSER') {
          return;
        }
        role.organizationMapContent[0].functionMapContent.forEach(fun => {
          if (!fun.function || !fun.function.val || fun.function.val !== 'ALERTS') {
            return;
          }
          ret = ret.concat(fun.permission);
        });
      });
    });

    return ret;
  }

  public canCreateAlerts() {
    return this.alertAdminPermissions().find(role => role.val === 'CREATE');
  }

  public canEditAlerts() {
    return this.alertAdminPermissions().find(role => role.val === 'EDIT');
  }
}
