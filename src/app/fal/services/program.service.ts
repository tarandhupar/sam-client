import {Injectable} from '@angular/core';
import {APIService} from '../../common/service/api/api.service'
import 'rxjs/add/operator/map';

@Injectable()
export class ProgramService{

  constructor(private oAPIService: APIService){}

  getProgramById(id: string) {
    let oApiParam = {
        name: 'program',
        suffix: '/' + id,
        oParam: {},
        method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
