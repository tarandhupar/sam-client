import {Injectable} from '@angular/core';
import {APIService} from '../../common/service/api.service'
import 'rxjs/add/operator/map';

@Injectable()
export class HistoricalIndexService{

  constructor(private oAPIService: APIService){
    console.log('Historical Index Service Started... ');
  }

  getHistoricalIndexByProgramNumber(id: string, programNumber: string) {
    let oApiParam = {
      name: 'historicalIndex',
      suffix: '/'+id+'?programNumber='+programNumber,
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}