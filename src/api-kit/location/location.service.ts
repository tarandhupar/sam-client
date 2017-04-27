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
      suffix: '/countries',
      oParam: {searchby: searchStr ,q:q},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets autocomplete countries
  getAutoCompleteCountries(q:string) {
    var oApiParam = {
      name: 'location',
      suffix: '/countries',
      oParam: {q:q},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets all state
  getAllStates(countryCode:string) {
    var oApiParam = {
      name: 'location',
      suffix: '/states',
      oParam: {cc:countryCode},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //search state by statecode, statename or statetype, can also provide country code
  searchState(searchStr:string, q:string, countryCode:string){
    var oApiParam = {
      name: 'location',
      suffix: '/states',
      oParam: {searchby: searchStr, q:q, cc:countryCode},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets autocomplete states
  getAutoCompleteStates(q:string, countryCode:string) {
    var oApiParam = {
      name: 'location',
      suffix: '/states',
      oParam: {q:q, cc:countryCode},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets all state
  getAllCounties(stateCode:string) {
    var oApiParam = {
      name: 'location',
      suffix: '/counties',
      oParam: {stateCode:stateCode},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //search state by stateId, StateCode, countName, iswdolcounty
  searchCounty(iswdolcounty:string, stateCode:string, countyname:string){
    var oApiParam = {
      name: 'location',
      suffix: '/counties',
      oParam: {iswdolcounty: iswdolcounty, stateCode:stateCode, countyname:countyname},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets autocomplete counties
  getAutoCompleteCounties(q:string, stateCode:string) {
    var oApiParam = {
      name: 'location',
      suffix: '/counties',
      oParam: {q:q, stateCode:stateCode},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
