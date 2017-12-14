import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { WrapperService } from '../wrapper/wrapper.service'

@Injectable()
export class OpportunityService {

  constructor(private oAPIService: WrapperService) {}

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

  getContractOpportunityById(id: string, authToken: string = null) {
    let apiParam = {
      name: 'contractOpportunity',
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

  saveContractOpportunity(id: String = null, data: any, authToken: string = null) {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: (id == null) ? '/opportunities' : '/opportunities/' + id,
      oParam: {},
      headers: {},
      body: data,
      method: (id == null || id == '') ? 'POST' : 'PATCH'
    };

    if (typeof authToken !== 'undefined' && authToken !== '' && authToken != null) {
      oApiParam.headers = {
        "X-Auth-Token": authToken
      }
    }
    return this.oAPIService.call(oApiParam, false);
  }

  deleteContractOpportunity(id: String, authToken: string = null) {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities/' + id,
      oParam: {},
      headers: {},
      method: 'DELETE'
    };

    if (typeof authToken !== 'undefined' && authToken !== '' && authToken != null) {
      oApiParam.headers = {
        "X-Auth-Token": authToken
      };
    }

    return this.oAPIService.call(oApiParam, false);
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

  getContractOpportunityHistoryById(id: string, authToken: string = null) {
    let apiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities/' + id + '/history',
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

  getContractOpportunityPackages(noticeIds: string, authToken: string = null) {
    let apiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities/attachments',
      oParam: {
        'noticeIds': noticeIds
      },
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

  getContractOpportunityPackagesCount(noticeIds: string, authToken: string = null) {
    let apiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities/packages/count',
      oParam: {
        'noticeIds': noticeIds
      },
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

  searchRelatedOpportunities(keyword: string, type: string, size: number, cookie: string) {
    let apiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities/relatedopportunities/' + type,
      oParam: {
        'keyword': keyword,
        'size': size,
      },
      headers: {
        'X-Auth-Token': cookie,
      },
      method: 'GET'
    };
    return this.oAPIService.call(apiParam);
  }

  runOpportunity(obj): Observable<any> {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities',
      oParam: {
        keyword: obj.keyword,
        page: (obj.pageNum == undefined) ? '' : obj.pageNum,
        status: (obj.status == undefined) ? '' : obj.status,
        noticeType: (obj.noticeType == undefined) ? '' : obj.noticeType,
        organizationId: (obj.organizationId == undefined) ? '' : obj.organizationId,
        postedFrom: (obj.dateFilter && obj.dateTab && obj.dateTab === 'posted') ? obj.dateFilter.startDate : '',
        postedTo: (obj.dateFilter && obj.dateTab && obj.dateTab === 'posted') ? obj.dateFilter.endDate : '',
        responseFrom: (obj.dateFilter && obj.dateTab && obj.dateTab === 'response') ? obj.dateFilter.startDate : '',
        responseTo: (obj.dateFilter && obj.dateTab && obj.dateTab === 'response') ? obj.dateFilter.endDate : '',
        archivedFrom: (obj.dateFilter && obj.dateTab && obj.dateTab === 'archive') ? obj.dateFilter.startDate : '',
        archivedTo: (obj.dateFilter && obj.dateTab && obj.dateTab === 'archive') ? obj.dateFilter.endDate : '',
        sortBy: (obj.sortBy == undefined) ? '' : obj.sortBy,
        facets: (obj.facets == undefined) ? '' : obj.facets
      },
      headers: {
        "X-Auth-Token": obj.Cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getPermissions(cookie: string): Observable<any> {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities',
      oParam: {
        size: 0,
        includeCount: false
      },
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
