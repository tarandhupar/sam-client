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

  saveProgram(id: String = null, data: any) {
    let oApiParam = {
      name: 'program',
      suffix: (id == null) ? '' : '/' + id,
      oParam: {},
      body: data,
      method: (id == null) ? 'POST' : 'PATCH'
      /*headers: {
        'X-Auth-Token': 'GSA_CFDA_R_cfda_agency_coord',
        'Content-Type': 'application/json'
      }*/
    };

    return this.oAPIService.call(oApiParam, false);
  }
}
