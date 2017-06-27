import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

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

  getRAOById(id){
    let oApiParam = {
      name: 'program',
      suffix: '/regionalOffices/' + id,
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  submitRAO(id: String = null, data: any, cookie: string){
    let oApiParam = {
      name: 'program',
      suffix: (id == null) ? '/regionalOffices' : '/regionalOffices' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: (id == null) ? 'POST' : 'PATCH'
    };

    return this.oAPIService.call(oApiParam);
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

    return this.oAPIService.call(oApiParam);
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
        sortBy: (obj.sortBy == undefined) ? '' : obj.sortBy
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

  getPermissions(cookie: string, permissions: any, orgId: string = null) {
    let oApiParam = {
      name: 'program',
      suffix: '/permissions',
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

  getReasons(id: string,cookie: string,) {
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

  rejectProgram(id, data: any, cookie: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequests/' + id + '/reject',
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
      suffix: '/programRequests/countPendingRequests',
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
}
