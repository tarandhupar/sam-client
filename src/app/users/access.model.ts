import { UserAccessInterface } from "api-kit/access/access.interface";
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

  static CreateAccessObject(user, roleId, domainId, orgIds, functions: Array<FunctionInterface>, messages: string): UserAccessInterface {
    let functionMapContent = functions.map(fun => {
      return {
        function: fun.id,
        permission: fun.permissions,
      };
    }).filter(fun => {
      return !!fun.permission.length;
    });

    let organizationMapContent = orgIds.map(orgId => {
      return {
        orgKey: ""+orgId,
        functionMapContent: functionMapContent
      };
    });

    return {
      messages: messages,
      user: user,
      // roleMapContent: [
      //   {
      //     role: roleId,
      //     roleData: [
      //       {
      //         domain: domainId,
      //         organizationMapContent: organizationMapContent
      //       }
      //     ]
      //   }
      // ]
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

  //   let roleData = [];
  //   roleData = this.userAccessModel.checkRoles(raw,"SUPERUSER");
  //   let functionMap = [];
  //   if(roleData.length !== 0){
  //     functionMap = this.userAccessModel.checkDomain(roleData,"ADMIN");
  //     if(functionMap.length !== 0){
  //       let permission = [];
  //       permission = this.userAccessModel.checkFunction(functionMap,"ALERTS");
  //       if(permission.length !== 0){
  //         permission.forEach(
  //           perm => {
  //             if(perm.val === "CREATE"){
  //               this.states.isCreate = true;
  //             }
  //             else if(perm.val === "EDIT "){
  //               this.states.isEdit = true;
  //             }
  //           }
  //         )
  //       }
  //     }
  //   }

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
          ret.concat(fun.permission);
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
