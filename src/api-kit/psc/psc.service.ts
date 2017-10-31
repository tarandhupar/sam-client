import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class PscService {

  constructor(private oAPIService: WrapperService) { }

  //gets all countries
  getTopLevelActivePscs() {
    let queryParams: any = {};
    queryParams.size = 1;
    queryParams.active = 'Y';
    queryParams.searchby = 'psc';

    var oApiParam = {
      name: 'location',
      suffix: '/psc',
      oParam: queryParams,
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //Autocomplete by psccode or title
  searchPsc(active:string, searchVal:string){
    let queryParams: any = {};
    queryParams.q = searchVal;
    queryParams.active = active;

    var oApiParam = {
      name: 'location',
      suffix: '/psc',
      oParam: queryParams,
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
