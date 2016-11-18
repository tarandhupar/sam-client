import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class OpportunityService{

  constructor(private oAPIService: WrapperService){}

  getOpportunityById(id: string) {
    let apiParam = {
        name: 'opportunity',
        suffix: '/' + id,
        oParam: {'load_parent': true },
        method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }
}
