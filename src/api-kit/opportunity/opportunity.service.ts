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

  isOpportunityEnabled(cookie: string){
    let apiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities/permissions?permissions=test',
      oParam: {},
      headers: {},
      method: 'GET'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      apiParam.headers = {
        "X-Auth-Token": cookie
      };
    }

    return this.oAPIService.call(apiParam, false);
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

  saveContractOpportunity(id: String = null, data: any) {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: (id == null) ? '' : '/' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": ''
      },
      body: data,
      method: (id == null || id == '') ? 'POST' : 'PATCH'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  deleteContractOpportunity(id: String) {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: '/' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": ''
      },
      method: 'DELETE'
    };

    /*if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }*/

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

  runOpportunity(obj) {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities',
      oParam: {
        keyword: obj.keyword,
        page: (obj.pageNum == undefined) ? '' : obj.pageNum,
      },
      headers: {
        "X-Auth-Token": obj.Cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getPermissions(cookie: string, permissions: any, orgId: string = null) {
    let oApiParam = {
      name: 'contractOpportunity',
      suffix: '/opportunities/permissions',
      oParam: {
        permissions: permissions
      },
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    if(orgId != null) {
      oApiParam.oParam['organizationId'] = orgId;
    }

    return this.oAPIService.call(oApiParam);
  }
}
