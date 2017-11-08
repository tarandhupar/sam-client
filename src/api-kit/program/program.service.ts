import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import {ResponseContentType} from "@angular/http";

@Injectable()
export class ProgramService{

  constructor(private oAPIService: WrapperService){}

  getRegionalOffices(obj){
    let oApiParam = {
      name: 'program',
      suffix: '/regionalOffices',
      oParam: {
        keyword: (obj.keyword == undefined) ? '' : obj.keyword,
        all: (obj.all == undefined) ? '' : obj.all,
        includeCount : (obj.includeCount == undefined) ? '' : obj.includeCount,
        limit: (obj.limit == undefined) ? '' : obj.limit,
        page: (obj.page == undefined) ? '' : obj.page,
        oFilterParam: (obj.oFilterParam == undefined) ? '' : obj.oFilterParam,
        sortBy: (obj.sortBy == undefined) ? '' : obj.sortBy,
        "_options.hal.link": (obj.optionsHal == undefined) ? '' : obj.optionsHal
      },
      headers: {
        "X-Auth-Token": obj.Cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getRAOById(id, cookie:string = null){
    let oApiParam = {
      name: 'program',
      suffix: '/regionalOffices/' + id,
      oParam: {},
      headers: {},
      method: 'GET'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }

    return this.oAPIService.call(oApiParam);
  }

  submitRAO(id: String = null, data: any, cookie: string){
    let oApiParam = {
      name: 'program',
      suffix: (id == null) ? '/regionalOffices' : '/regionalOffices/' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: (id == null) ? 'POST' : 'PUT'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  deleteRAO(id: String, cookie: string){
    let oApiParam = {
      name: 'program',
      suffix: '/regionalOffices/' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'DELETE'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  getProgramById(id: string, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id,
      oParam: {},
      headers: {},
      method: 'GET'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }
    return this.oAPIService.call(oApiParam);

  }

  isCfdaCodeRestricted(orgId: string, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/federalHierarchyConfigurations/' + orgId + '/isCfdaCodeRestricted',
      oParam: {},
      headers: {},
      method: 'GET'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }

    return this.oAPIService.call(oApiParam);
  }

  getFederalHierarchyConfiguration(orgId: string, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/federalHierarchyConfigurations/' + orgId,
      oParam: {},
      headers: {},
      method: 'GET'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }

    return this.oAPIService.call(oApiParam);
  }

  getFederalHierarchyConfigurations(orgKeys: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/federalHierarchyConfigurations/',
      oParam: {
        orgKeys: orgKeys
      },
      headers: {},
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  }

  getNextAvailableProgramNumber(orgId: string, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/nextAvailableProgramNumber/',
      oParam: {
        organizationId: orgId
      },
      headers: {},
      method: 'GET'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }

    return this.oAPIService.call(oApiParam);
  }

  isProgramNumberUnique(progNum: string, id:string, cookie: string, newOrgId: string = null) {
    let oApiParam = {
      name: 'program',
      suffix: '/isProgramNumberUnique',
      oParam: {
        programNumber: progNum,
        organizationId: (newOrgId) ? newOrgId : '',
        id: id
      },
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getRequests(obj){
    let oApiParam = {
      name: 'program',
      suffix: '/programRequests',
      oParam: {
        program: (obj.programId == undefined) ? '':obj.programId,
        page: (obj.pageNum == undefined) ? '' : obj.pageNum,
        type: (obj.type == undefined) ? '' : obj.type,
        keyword : (obj.keyword == undefined) ? '' : obj.keyword,
        completed: (obj.isCompleted == undefined) ? '' : obj.isCompleted,
        size: (obj.size == undefined) ? '' : obj.size,
        includeCount: (obj.includeCount == undefined) ? '' : obj.includeCount
      },
      headers: {
        "X-Auth-Token": obj.Cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);

  }

  runProgram(obj) {
    let oApiParam = {
      name: 'program',
      suffix: '/',
      oParam: {
        keyword: obj.keyword,
        page: (obj.pageNum == undefined) ? '' : obj.pageNum,
        status: (obj.status == undefined) ? '' : obj.status,
        includeCount : (obj.includeCount == undefined) ? '' : obj.includeCount,
        size: (obj.size == undefined) ? '' : obj.size,
        sortBy: (obj.sortBy == undefined) ? '' : obj.sortBy,
        postedFrom: (obj.dateFilter && obj.dateTab && obj.dateTab === 'posted') ? obj.dateFilter.startDate : '',
        postedTo: (obj.dateFilter && obj.dateTab && obj.dateTab === 'posted') ? obj.dateFilter.endDate : '',
        modifiedFrom: (obj.dateFilter && obj.dateTab && obj.dateTab === 'modified') ? obj.dateFilter.startDate : '',
        modifiedTo: (obj.dateFilter && obj.dateTab && obj.dateTab === 'modified') ? obj.dateFilter.endDate : '',
        organizationId: (obj.organizationId == undefined) ? '' : obj.organizationId,
        requestType: (obj.requestType == undefined) ? '' : obj.requestType,
        facets: 'status, pendingChangeRequest'
      },
      headers: {
        "X-Auth-Token": obj.Cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  saveProgram(id: String = null, data: any, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: (id == null) ? '' : '/' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: (id == null) ? 'POST' : 'PATCH'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  saveCFDAConfiguration(orgId: String = null, data: any, cookie:string){
    let oApiParam = {
      name: 'program',
      suffix: '/federalHierarchyConfigurations/' + orgId,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: 'PUT'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  reviseProgram(id: String, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id + '/revise',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'POST'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  deleteProgram(id: String, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id,
      oParam: {},
      headers: {},
      method: 'DELETE'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }

    return this.oAPIService.call(oApiParam, false);
  }

  getPermissions(cookie: string, permissions: any = null, orgId: string = null) {
    let paramObj = {};
    if(permissions !== null) {
      paramObj['permissions'] = permissions;
    } else {
      paramObj['size'] = 0;
    }

    let oApiParam = {
      name: 'program',
      suffix: (permissions !== null) ? '/permissions' : '/',
      oParam: paramObj,
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

  getPendingRequest(cookie: string, id: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id + '/pendingRequest',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getCfdaCode(orgId) {
    let oApiParam = {
      name: 'program',
      suffix: '/getCfdaCode',
      oParam: {
        organizationId: orgId
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  }

  getContacts(cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/contacts',
      oParam: {},
      headers: {},
      method: 'GET'
    };

    if(typeof cookie !== 'undefined' && cookie !== ''){
      oApiParam.headers = {
        "X-Auth-Token": cookie
      };
    }
    return this.oAPIService.call(oApiParam);
  }

  falautosearch(q:string, ids: string) {
    let oApiParam = {
      name: 'relatedPrograms',
      suffix: '/',
      oParam: {
        keyword: q,
        ids: ids
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  }

  submitProgram(id, data: any, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id + '/submit',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: 'POST'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  getReasons(id: string,cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequestActions/' + id,
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  falWFRequestTypeProgram(id, data: any, cookie: string, workflowRequestType: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequests/' + id + workflowRequestType,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: 'POST'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  getCountPendingRequests(cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequests/reports/requestCount/pending',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  sendNotification(id: string, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id + '/submissionNotification',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getActionHistoryAndNote(cookie: string, id: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id + '/actionHistoryAndNote',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getLatestUnpublishedRevision(id: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id + '/getLatestUnpublishedRevision',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
  getTemplate(cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/template/download',
      responseType: ResponseContentType.Blob,
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };
  
    return this.oAPIService.call(oApiParam, false);
  }
}
