import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class OpportunityService {

  constructor(private oAPIService: WrapperService) { }

  getOpportunityById(id: string, authToken: string = null) {
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/' + id,
      oParam: {},
      headers: {},
      method: 'GET'
    };

    if (typeof authToken !== 'undefined' && authToken !== '' && authToken != null) {
      apiParam.headers = {
        "X-Auth-Token": authToken
      }
    }

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

  getOpportunityIVLs(accessToken: string, noticeId: string, keyword: string, page: number, size: number, sort: string): Observable<any> {
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/' + noticeId + '/ivl',
      oParam: {
        'keyword': keyword,
        'page': page,
        'size': size,
        'sortBy': sort,
        'includeCount': true
      },
      method: 'GET',
      headers: {
        "X-Auth-Token": accessToken
      },
    };

    return this.oAPIService.call(apiParam);
  }

  getPackages(noticeIds: string) {
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/attachments',
      oParam: {
        'noticeIds': noticeIds
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getPackagesCount(noticeIds: string) {
    let apiParam = {
      name: 'opportunity',
      suffix: '/opportunities/packages/count',
      oParam: {
        'noticeIds': noticeIds
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }


  getRelatedOpportunitiesByIdAndType(id: string, type: string, page: number, sort: string) {
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
