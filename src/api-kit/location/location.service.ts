import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class LocationService {

  constructor(private oAPIService: WrapperService) { }

  //gets all countries
  getAllContries() {
    var oApiParam = {
      name: 'location',
      suffix: '/countries',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //search country by country code or country name
  searchCountry(searchStr:string, q:string){
    var oApiParam = {
      name: 'location',
      suffix: '/country',
      oParam: {searchby: searchStr ,q:q},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
