import { Pipe, PipeTransform } from '@angular/core';
import {FilterMultiArrayObjectPipe} from "../../app-pipes/filter-multi-array-object.pipe";


@Pipe({name: 'statesCounties'})
export class StatesCountiesPipe implements PipeTransform {
  /** TODO: ACCOUNT FOR DAYLIGHT SAVINGS TIME **/


  transform(wdLocation: any, dictionaries:any): any {
    console.log("dictionaries: ",dictionaries);
    let filterMultiArrayObjectPipe = new FilterMultiArrayObjectPipe();
    let statesString = "";
    let countiesString = "";
    let county:string;
    let resultCounty:any;
    for (let location of wdLocation) {
      let state:string;
      let resultState = filterMultiArrayObjectPipe.transform([location.state], dictionaries.state, 'element_id', false, "");
      state = (resultState instanceof Array && resultState.length > 0) ? resultState[0].value : [];
      statesString = statesString.concat(state + ", ");
      countiesString = countiesString.concat(state + " - ");
      if (location.statewideFlag && !location.hasOwnProperty('counties') ){
        countiesString = countiesString.concat("Statewide, ");
      } else if (location.statewideFlag && location.hasOwnProperty('counties')){
        countiesString = countiesString.concat("All Counties except: ");
        for (let countyElement of location.counties) {
          county = null;
          resultCounty = filterMultiArrayObjectPipe.transform([countyElement.toString()], dictionaries.county, 'element_id', false, "");
          if (county == null) {
            county = (resultCounty instanceof Array && resultCounty.length > 0) ? resultCounty[0].value : [];
          }
          countiesString = countiesString.concat(county + ", ");
        }
      } else if(!location.statewideFlag)
        for (let countyElement of location.counties) {
          county = null;
          resultCounty = filterMultiArrayObjectPipe.transform([countyElement.toString()], dictionaries.county, 'element_id', false, "");
          if (county == null) {
            county = (resultCounty instanceof Array && resultCounty.length > 0) ? resultCounty[0].value : [];
          }
          countiesString = countiesString.concat(county + ", ");
        }
    }
    countiesString = countiesString.substring(0, countiesString.length - 2);
    statesString = statesString.substring(0, statesString.length - 2);
    return {states:statesString, counties:countiesString}
  }
}
