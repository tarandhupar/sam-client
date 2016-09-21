import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filterMultiArrayObject'})
export class FilterMultiArrayObjectPipe implements PipeTransform {
  transform(aValue:any[], aData:any[], fieldName:string, isNested:boolean, nestedFieldName:string):any[] {

    let aTmpArray = aData;
    let aResults:any[] = [];

    //nested array of objects
    if (isNested === true) {
      //looping through first items in array
      aData.forEach(function (item) {
        //check if this item has nested array
        if (item[nestedFieldName] && item[nestedFieldName] instanceof Array) {
          aTmpArray = aTmpArray.concat(item[nestedFieldName])
        }
      });
    }

    aValue.forEach(value => {
      let aTmp = aTmpArray.filter(item => {
        if (value === item[fieldName]) {
          return item;
        }
      });

      aResults = aResults.concat(aTmp);
    });

    return aResults;
  }
}
