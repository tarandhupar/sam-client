import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class OpportunityService{

  constructor(private oAPIService: WrapperService){}

  getOpportunityById(id: string, includeParent: boolean) {
    let apiParam = {
        name: 'opportunity',
        suffix: '/' + id,
        oParam: {'includeParent': true },
        method: 'GET'
    };

    if (includeParent) {
      apiParam.oParam['includeParent'] = 'true';
    }

    return this.oAPIService.call(apiParam);
  }

  getOpportunityOrganizationById(id: string) {
    let apiParam = {
        name: 'opportunity',
        suffix: '/' + id + '/organization',
        oParam: {},
        method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getOpportunityLocationById(id: string) {
    let apiParam = {
        name: 'opportunity',
        suffix: '/' + id + '/location',
        oParam: {},
        method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }
}
