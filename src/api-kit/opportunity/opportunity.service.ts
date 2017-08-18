import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class OpportunityService{

  constructor(private oAPIService: WrapperService){}

  getOpportunityById(id: string) {
    let apiParam = {
        name: 'opportunity',
        suffix: '/opportunities/' + id,
        oParam: {},
        method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getOpportunityHistoryById(id: string) {
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/' + id + '/history',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getOpportunityLocationById(id: string) {
    let apiParam = {
        name: 'opportunity',
        suffix: '/opportunities/' + id + '/location',
        oParam: {},
        method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }
  

  getPackages(noticeIds: string){
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/attachments',
      oParam: {
        'noticeIds':noticeIds
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getPackagesCount(noticeIds: string){
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/packages/count',
      oParam: {
        'noticeIds':noticeIds
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }


  getRelatedOpportunitiesByIdAndType(id:string, type:string, page:number, sort:string){
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/' + id + '/relatedopportunities',
      oParam: {
        'type': type,
        'page': page,
        'sort': sort,
      },
      method: 'GET'
    };
    return this.oAPIService.call(apiParam);
  }
}
