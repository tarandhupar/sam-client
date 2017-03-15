import { UserAccessInterface2 } from "api-kit/access/access.interface";
import { PropertyCollector } from "../app-utils/property-collector";
import * as _ from 'lodash';

export interface FunctionInterface {
  id: string|number,
  permissions: Array<string|number>
}

export class UserAccessModel {
  private _raw: UserAccessInterface2;
  private collector: PropertyCollector;

  private constructor() {  }

  static FromResponse(res: UserAccessInterface2): UserAccessModel {
    let a = new UserAccessModel();
    a._raw = res;
    a.collector = new PropertyCollector(res);
    return a;
  }

  static FormInputToAccessObject(user, roleId, domainId, orgIds, functions: Array<FunctionInterface>, messages: string): UserAccessInterface2 {
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
      roleMapContent: [
        {
          role: roleId,
          roleData: [
            {
              domain: domainId,
              organizationMapContent: organizationMapContent
            }
          ]
        }
      ]
    };
  }

  public raw(): UserAccessInterface2 {
    return this._raw;
  }

  public allOrganizations() {
    let orgKeys = this.collector.collect(['domainMapContent', [], 'roleMapContent', [], 'organizationMapContent', [], 'organizations', []]);
    return _.uniq(orgKeys);
  }

  public allOrganizations2() {

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

  private isAdminForAlerts() {

  }

  public canCreateAlerts() {
    if (this.isAdminForAlerts()) {
      return false;
    }

  }

  public canEditAlerts() {
    if (this.isAdminForAlerts()) {
      return false;
    }
  }

  // public checkRoles(useraccess,validate: string) {
  //   let res = [];
  //   useraccess.roleMapContent.forEach(
  //     value =>{
  //       if(value.role.val === validate){
  //         res = value.roleData;
  //       }
  //     }
  //   )
  //   return res;
  // }
  //
  // public checkDomain(useraccess,validate:string){
  //   let res = [];
  //   useraccess.forEach(
  //     role => {
  //       if(role.domain.val === validate){
  //         res = role.organizationMapContent.functionMapContent;
  //       }
  //     }
  //   )
  //   return res;
  // }
  //
  // public checkFunction(useraccess,validate:string){
  //   let res = [];
  //   useraccess.forEach(
  //     funct => {
  //       if(funct.function.val === "ALERTS"){
  //         res = funct.permission;
  //       }
  //     }
  //   )
  //   return res;
  // }

}
