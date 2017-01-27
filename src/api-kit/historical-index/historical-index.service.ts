import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class HistoricalIndexService{

  constructor(private oAPIService: WrapperService){}

  getHistoricalIndexByProgramNumber(id: string, programNumber: string) {
    let oApiParam = {
      name: 'historicalIndex',
      suffix: '/' + id,
      oParam: {
          'programNumber': programNumber
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
