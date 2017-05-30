import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramService{

  constructor(private oAPIService: WrapperService){}

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

  getPermissions(cookie: string, permissions: any) {
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

    return this.oAPIService.call(oApiParam, false);
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
}
