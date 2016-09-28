import {Injectable} from '@angular/core';
import {APIService} from '../../common/service/api/api.service'
import 'rxjs/add/operator/map';

@Injectable()
export class HistoricalIndexService{

  constructor(private oAPIService: APIService){}

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