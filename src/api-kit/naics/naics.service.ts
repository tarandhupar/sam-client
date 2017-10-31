import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class NaicsService {

  constructor(private oAPIService: WrapperService) { }

  //gets all Top Level NAICS
  getTopLevelNaics() {
    let queryParams: any = {};
    queryParams.size = 2;

    var oApiParam = {
      name: 'location',
      suffix: '/naics',
      oParam: queryParams,
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

    //Autocomplete by naicscode or title
  searchNaics(years:string[], maxLevel:string, searchVal:string){
    let queryParams: any = {};
    queryParams.q = searchVal;
    if(years && years.length > 0) {
      queryParams.sourceyear = years.join(',');
    }
    if(maxLevel) {
      queryParams.size = maxLevel;
    }

    var oApiParam = {
      name: 'location',
      suffix: '/naics',
      oParam: queryParams,
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
