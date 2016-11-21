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
        oParam: {},
        method: 'GET'
    };

    if (includeParent) {
      apiParam.oParam['includeParent'] = 'true';
    }

    return this.oAPIService.call(apiParam);
  }
}
