import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramService{

  constructor(private oAPIService: WrapperService){}

  getProgramById(id: string) {
    let oApiParam = {
        name: 'program',
        suffix: '/' + id,
        oParam: {},
        method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getLatestProgramById(id: string) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id + '/getLatestPublishedProgramByProgramId',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  runProgram(obj) {
    let oApiParam = {
      name: 'program',
      suffix: '/',
      oParam: {
        page: obj.pageNum
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
  getAuthProgramById(id: string, cookie) {
    let oApiParam = {
      name: 'program',
      suffix: '/' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
