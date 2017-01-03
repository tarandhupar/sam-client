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

  getOpportunityDictionary(ids: string) {
    let apiParam = {
        name: 'opportunity',
        suffix: '/dictionary',
        oParam: {
          ids: ids
        },
        method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getAttachmentById(id: string){
    let apiParam = {
      name: 'opportunity',
      suffix: '/' + id + '/attachments',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getRelatedOpportunitiesByIdAndType(id:string, type:string, page:number){
    let apiParam = {
      name: 'opportunity',
      suffix: '/' + id + '/relatedopportunities',
      oParam: {
        'type': type,
        'page': page
      },
      method: 'GET'
    };
    return this.oAPIService.call(apiParam);
  }
}
