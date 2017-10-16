import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

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

  //search city by city name and filter by country code and state code
  searchCity( q?:string, countrycode?:string, statecode?:string, searchStr?:string){
    var oApiParam = {
      name: 'location',
      suffix: '/cities',
      oParam: {q:q, cc:countrycode, searchvalue:statecode, searchby:searchStr},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets autocomplete countries
  getAutoCompleteCountries(q:string, active:string) {
    var oApiParam = {
      name: 'location',
      suffix: '/countries',
      oParam: {q:q, active:active},
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

  //gets autocomplete cities
  getAutoCompleteCities(q?:string, searchby?:string, searchvalue?:string, countryCode?:string, county?:string) {
    var oApiParam = {
      name: 'location',
      suffix: '/cities',
      oParam: {
        cc: countryCode,
        q: q,
        searchby: searchby,
        searchvalue: searchvalue,
        county: county
      },
      method: 'GET'
    };

    // if (typeof stateId === 'string') {
    //   oApiParam.oParam['searchby'] = "statecode";
    //   oApiParam.oParam['searchvalue'] = stateId;
    // }

    return this.oAPIService.call(oApiParam);
  }

  //gets autocomplete cities
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
  getAutoCompleteCounties(q?:string, searchby?:string, searchvalue?:string, city?:string ) {
    var oApiParam = {
      name: 'location',
      suffix: '/counties',
      oParam: {q:q, searchby:searchby, searchvalue:searchvalue, city },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getLocationByPostolCode(q:string){

    var oApiParam = {
      name: 'location',
      suffix: '/locations',
      oParam: {q:q, searchby:'zip'},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);

  }

  validateZipWIthLocation(zip:string, state?:any, city?:any){
    var oApiParam = {
      name: 'location',
      suffix: '/validatezip',
      oParam: {zip:zip},
      method: 'GET'
    };
    if(state) oApiParam.oParam['statecode'] = state.key;
    if(city) oApiParam.oParam['citycode'] = city.key;
    return this.oAPIService.call(oApiParam);
  }

  //gets naics details
  getNaicsDetails(sourceyear, code) {
    var oApiParam = {
      name: 'location',
      suffix: '/naics',
      oParam: {sourceyear:sourceyear, code:code},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  //gets psc details
  getPSCDetails(q) {
    var oApiParam = {
      name: 'location',
      suffix: '/psc',
      oParam: {q:q},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

}
