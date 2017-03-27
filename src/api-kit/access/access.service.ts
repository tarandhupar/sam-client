import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccessInterface, UserAccessWrapper } from './access.interface';
import * as _ from 'lodash';
import { IDomain } from "./domain.interface";
import { IRole } from "./role.interface";

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

  getAccess(userId: string, filterOptions?: any): Observable<UserAccessInterface> {
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userId + '/',
      method: 'GET',
      oParam: { fetchNames: 'true'}
    };

    if (filterOptions) {
      apiOptions.oParam = _.merge(apiOptions.oParam, filterOptions);
    }

    return this.apiService.call(apiOptions);
  }

  getRoles(queryParams, userName?): Observable< Array<IRole> > {
    let apiOptions: any = {
      name: 'uiroles',
      method: 'GET',
      suffix: '',
      oParam: {
        fetchNames: 'true',
      }
    };

    if (userName) {
      apiOptions.suffix = '/'+userName+'/';
    }

    apiOptions.oParam = _.merge(apiOptions.oParam, queryParams);
    return this.apiService.call(apiOptions);
  }

  getDomains(): Observable< IDomain > {
    let apiOptions: any = {
      name: 'domains',
      method: 'GET',
      suffix: '',
    };

    return this.apiService.call(apiOptions);
  }

  getDomainDefinition(domainId: number) {
    let apiOptions: any = {
      name: 'domaindefinition',
      method: 'GET',
      suffix: '',
    };

    return Observable.of({"domain":{"id":1,"val":"AWARD"},"roleDefinitionMapContent":[{"role":{"id":2,"val":"GENERAL PUBLIC"},"functionMapContent":[{"function":{"id":1,"val":"EXECUTIVE REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"}]},{"function":{"id":2,"val":"PUBLIC REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":3,"val":"IDV"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":4,"val":"AWARD"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":5,"val":"GOVERNMENT REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":6,"val":"WEBPORTAL"},"permission":[{"id":16,"val":"REFERENCE DATA MAINTENANCE"},{"id":17,"val":"REPORTS"},{"id":18,"val":"SEARCH/VIEW CONTRACTS"},{"id":12,"val":"USER MAINTENANCE"},{"id":15,"val":"DATA COLLECTION"}]},{"function":{"id":7,"val":"ADHOC REPORTS"},"permission":[{"id":13,"val":"VIEW"}]}]},{"role":{"id":3,"val":"CONTRACTING SPECIALIST"},"functionMapContent":[{"function":{"id":1,"val":"EXECUTIVE REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"}]},{"function":{"id":2,"val":"PUBLIC REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":3,"val":"IDV"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":4,"val":"AWARD"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":5,"val":"GOVERNMENT REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":6,"val":"WEBPORTAL"},"permission":[{"id":16,"val":"REFERENCE DATA MAINTENANCE"},{"id":17,"val":"REPORTS"},{"id":18,"val":"SEARCH/VIEW CONTRACTS"},{"id":12,"val":"USER MAINTENANCE"},{"id":15,"val":"DATA COLLECTION"}]},{"function":{"id":7,"val":"ADHOC REPORTS"},"permission":[{"id":13,"val":"VIEW"}]}]},{"role":{"id":4,"val":"CONTRACTING OFFICER/SPECIALIST"},"functionMapContent":[{"function":{"id":1,"val":"EXECUTIVE REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"}]},{"function":{"id":2,"val":"PUBLIC REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":3,"val":"IDV"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":4,"val":"AWARD"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":5,"val":"GOVERNMENT REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":6,"val":"WEBPORTAL"},"permission":[{"id":16,"val":"REFERENCE DATA MAINTENANCE"},{"id":17,"val":"REPORTS"},{"id":18,"val":"SEARCH/VIEW CONTRACTS"},{"id":12,"val":"USER MAINTENANCE"},{"id":15,"val":"DATA COLLECTION"}]},{"function":{"id":7,"val":"ADHOC REPORTS"},"permission":[{"id":13,"val":"VIEW"}]}]}],"functionMapContent":[{"function":{"id":1,"val":"EXECUTIVE REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"}]},{"function":{"id":2,"val":"PUBLIC REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":3,"val":"IDV"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":4,"val":"AWARD"},"permission":[{"id":1,"val":"APPROVE"},{"id":4,"val":"CREATE"},{"id":5,"val":"DELETE DRAFT"},{"id":6,"val":"ISCOMPLETE"},{"id":7,"val":"MODIFY"},{"id":8,"val":"UPDATE"},{"id":9,"val":"VALIDATE"},{"id":11,"val":"CORRECT"},{"id":14,"val":"DELETE"}]},{"function":{"id":5,"val":"GOVERNMENT REPORTS"},"permission":[{"id":2,"val":"GET"},{"id":3,"val":"SEND"},{"id":10,"val":"SCHEDULE"}]},{"function":{"id":6,"val":"WEBPORTAL"},"permission":[{"id":16,"val":"REFERENCE DATA MAINTENANCE"},{"id":17,"val":"REPORTS"},{"id":18,"val":"SEARCH/VIEW CONTRACTS"},{"id":12,"val":"USER MAINTENANCE"},{"id":15,"val":"DATA COLLECTION"}]},{"function":{"id":7,"val":"ADHOC REPORTS"},"permission":[{"id":13,"val":"VIEW"}]}]});
  }

  postAccess(access: UserAccessWrapper, userName) {
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userName + '/',
      method: 'POST',
      body: access
    };

    return this.apiService.call(apiOptions, false);
  }

  getRoleObjDefinitions(mode : string, domainKey : string){
    let apiOptions: any = {
      name: 'domainDefinition',
      suffix: '/',
      method: 'GET',
      oParam: { }
    };

    apiOptions.oParam.mode = mode || 'role';
    if( domainKey.length > 0 ){
      apiOptions.oParam.domainKey = domainKey;
    }

    return this.apiService.call(apiOptions);
  }
}
