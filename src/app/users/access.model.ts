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

  static FromResponse(res: any): UserAccessModel {
    let a = new UserAccessModel();
    a._raw = JSON.parse(res._body);
    a.collector = new PropertyCollector(res);
    return a;
  }

  static CreateGrantAndAcceptObject(messages, userName, domain, role, organizations, objects) {
    return {
      message: messages,
      mode: 'approve',
      updatedAccessContent: {
        user: userName,
        domainContent: [
          {
            domain: domain,
            roleContent: [
              {
                role: role,
                organizationContent: [
                  {
                    organizations: organizations,
                    functionContent: objects
                  }
                ]
              }
            ]
          },
        ]
      }
    };
  }

  static CreateDeletePartial(user, roleId, domainId, orgIds): UserAccessWrapper {
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

  static CreateRequestObject(requestor: string, supervisorName: string, supervisorEmail: string, domainId: number, message: string) {
    return {
      requestorName: requestor,
      supervisorName: supervisorName,
      supervisorEmail: supervisorEmail,
      domainId: +domainId,
      requestorMessage: message
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

  public raw(): any {
    return this._raw;
  }

}
