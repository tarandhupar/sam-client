import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';
import { AlphabetSelectorService } from "../../ui-kit/alphabet-selector/alphabet-selector.component";

@Injectable()
export class UserDirService implements AlphabetSelectorService{

  drillDownLimitLength: number = 3; // the limit level of drill down
  pageCount:number = 4;
  firstLayerChars: any;

  constructor(private apiService: WrapperService) {
    this.firstLayerChars = this.randomAvailableChars('');
  }

  getData(checkPrefix:boolean, prefix:string, offset:number){

    let oParam = {
      prefix: prefix,
      offset: offset,
      checkPrefix: checkPrefix
    }

    // TODO: Uncomment when alphabet-selector api service is up
    // let apiOptions: any = {
    //   name: 'alphabet-selector',
    //   suffix: '',
    //   method: 'GET',
    //   oParam: { }
    // };
    //
    // return this.apiService.call(apiOptions);

    let result = {};
    if(oParam.checkPrefix){
      if(oParam.prefix === ''){
        // Get the first layer prefix result size data with first page data
        result = this.getDefault();
      }else{
        result = this.getPrefixData(oParam.prefix);
      }
    }else{
      result = {
        resultSizeByAlphabet: {},
        resultData: this.randomPrefixResults(oParam.prefix, oParam.offset)
      };
    }

    return Observable.of(result);
  }

  getDefault() {
    let firstChar = Object.keys(this.firstLayerChars)[0];
    let defaultInfo = {
      resultSizeByAlphabet: this.firstLayerChars,
      resultData: this.randomPrefixResults(firstChar, 1)
    };
    return defaultInfo;
  }

  /**
   * Get the next layer available prefix and the data related to selected prefix
   *
   * @param prefix: the prefix selected to get next layer of alphabet selector
   * @returns {Observable<>}
   */
  getPrefixData(prefix:string){

    let prefixData: any;
    let nextLayerPrefix = this.randomAvailableChars(prefix);
    let nextLayerSampleData = {
      resultSizeByAlphabet:nextLayerPrefix,
      resultData: this.randomPrefixResults(prefix, 1)
    };
    let noNextLayerSampleData = {
      resultSizeByAlphabet:{},
      resultData: this.randomPrefixResults(prefix,1)
    };
    prefixData = noNextLayerSampleData;

    // Each prefix may or may not have a drill down layer
    let drilldown = Math.random() >= 0.5;

    // Do not break down too far for now, set the threshold to control it
    if(prefix.length < this.drillDownLimitLength && drilldown){
      prefixData = nextLayerSampleData;
    }

    return prefixData;
  }

  randomAvailableChars(prefix){
    let availableChars = {};
    let length = Math.floor(Math.random() * 26) + 1;
    let chars = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    let numToChoose = Array.from( Array(26).keys());
    let nums = [];

    // randomly choose next letters in alphabetic order
    for(var i = 0;i < length;i++){
      let j = Math.floor(Math.random() * numToChoose.length);
      nums.push(j);
      numToChoose.splice(j,1);
    }
    nums = nums.sort((v1,v2)=>{return v1-v2;});

    // Assign each prefix a number to represent the related number of results
    for(var i=0;i<length;i++){
      availableChars[prefix.toUpperCase()+chars[nums[i]]] = Math.floor(Math.random() * 200) + 1;
    }
    return availableChars;
  }

  randomPrefixResults(prefix: string, offset:number){
    let resultData = [];
    // Insert fake result related to the prefix and offset to demo
    for(let i = 0; i < this.pageCount; i++){
      resultData.push({LastName: prefix+String.fromCharCode(i + 65), FirstName: String.fromCharCode(i + 65) + '-' + offset})
    }
    return resultData;
  }
}
