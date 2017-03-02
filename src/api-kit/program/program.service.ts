import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramService {

  constructor(private oAPIService: WrapperService) {
  }

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
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
