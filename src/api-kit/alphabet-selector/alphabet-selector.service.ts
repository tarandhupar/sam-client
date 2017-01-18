import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class AlphabetSelectorService {

  private drillDownLimitLength: number = 3;
  private pageCount:number = 4;
  private firstLayerChars: any;

  constructor(private apiService: WrapperService) {
    this.firstLayerChars = this.randomAvailableChars('');
  }

  getDefault(offset:number) {

    // TODO: Uncomment when alphabet-selector api service is up
    // let apiOptions: any = {
    //   name: 'alphabet-selector',
    //   suffix: '',
    //   method: 'GET',
    //   oParam: { }
    // };
    //
    // return this.apiService.call(apiOptions);

    let firstChar = Object.keys(this.firstLayerChars)[0];
    let defaultInfo = {
      resultSizeByAlphabet: this.firstLayerChars,
      resultData: this.randomPrefixResults(firstChar, offset)
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
      resultSizeByAlphabet:this.randomAvailableChars(prefix),
      resultData: this.randomPrefixResults(prefix, offset)
    };
    let noNextLayerSampleData = {
      resultSizeByAlphabet:{},
      resultData: this.randomPrefixResults(prefix,offset)
    };
    prefixData = noNextLayerSampleData;

    // Each prefix may or may not have a drill down layer
    let drilldown = Math.random() >= 0.5;
    // let drilldown = true;

    // Do not break down too far for now, set the threshold to control it
    if(prefix.length < this.drillDownLimitLength && drilldown){
      prefixData = nextLayerSampleData;
    }

    return Observable.of(prefixData);
  }

  randomAvailableChars(prefix){
    let availableChars = [];
    let length = Math.floor(Math.random() * 26) + 1;
    let chars = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    let numToChoose = Array.from( Array(26).keys());
    let nums = [];
    for(var i = 0;i < length;i++){
      let j = Math.floor(Math.random() * numToChoose.length);
      nums.push(j);
      numToChoose.splice(j,1);
    }
    nums = nums.sort((v1,v2)=>{return v1-v2;});
    
    // randomly choose next letters in alphabetic order
    for(var i=0;i<length;i++){
      availableChars[prefix.toUpperCase()+chars[nums[i]]] = Math.floor(Math.random() * 200) + 1;

    }
    return availableChars;
  }

  randomPrefixResults(prefix: string, offset:number){
    let resultData = [];
    for(let i = 0; i < this.pageCount; i++){
      resultData.push({LastName: prefix+String.fromCharCode(i + 65), FirstName: String.fromCharCode(i + 65) + '-' + offset})
    }
    return resultData;
  }
}
