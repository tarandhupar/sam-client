import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class AlphabetSelectorService {

  private drillDownLimitLength: number = 3;

  constructor(private apiService: WrapperService) {}

  getDefault() {

    // TODO: Uncomment when alphabet-selector api service is up
    // let apiOptions: any = {
    //   name: 'alphabet-selector',
    //   suffix: '',
    //   method: 'GET',
    //   oParam: { }
    // };
    //
    // return this.apiService.call(apiOptions);

    let defaultInfo = {
      resultSizeByAlphabet: this.randomAvailableChars(),
      restulData: this.randomPrefixResults('', 0)

    };

    return Observable.of(defaultInfo);
  }

  /**
   *
   * @param prefix: the prefix selected to get next layer of alphabet selector
   * @param offset: the page number under current prefix filter
   * @returns {Observable<>}
   */
  getPrefixData(prefix:string, offset:number){

    let prefixData: any;
    let nextLayerSampleData = {
      resultSizeByAlphabet:this.randomAvailableChars(),
      resultData: this.randomPrefixResults(prefix, offset)
    };
    let noNextLayerSampleData = {
      resultSizeByAlphabet:{},
      resultData: this.randomPrefixResults(prefix,offset)
    };
    prefixData = noNextLayerSampleData;

    // Each prefix may or may not have a drill down layer
    //let drilldown = Math.random() >= 0.5;
    let drilldown = true;

    // Do not break down too far for now, set the threshold to control it
    if(prefix.length < this.drillDownLimitLength && drilldown){
      prefixData = nextLayerSampleData;
    }

    return Observable.of(prefixData);
  }

  randomAvailableChars(){
    let availableChars = {};
    let length = Math.floor(Math.random() * 26) + 1;
    let chars = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    for(var i = 0;i < length;i++){
      let j = Math.floor(Math.random() * chars.length);
      availableChars[chars[j]] = Math.floor(Math.random() * 10000) + 1;
      chars.splice(j,1);
    }
    return availableChars;
  }

  randomPrefixResults(prefix: string, offset:number){
    return [
      {LastName: prefix+'-AA', FirstName: 'A-'+offset},
      {LastName: prefix+'-AB', FirstName: 'B-'+offset},
      {LastName: prefix+'-AC', FirstName: 'C-'+offset},
    ];
  }
}
