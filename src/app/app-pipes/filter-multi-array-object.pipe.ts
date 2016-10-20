import {Pipe, PipeTransform} from '@angular/core';

/**
 * Function to return an array of matched data by an ID
 * 
 * This function accept flat array of object of data or hierarchical array of objects
 *  
 * @param Array aValue | ["2"]
 * @param Array aData | [{"id": "1", "value":"foo", "children": [{"id":"11", "value": "foo 1.1"}], {"id": "2", value: "bar"} }]
 * @param String fieldName | "id" ; the field name in @param aData to search @param aValue against
 * @param isNested Boolean | true/false ; has @param aData children field to search data against
 * @param nestedFieldName String | "children" ; the field name in @param aData to search @param aValue against 
 * 
 * @returns Array of object | [{"id": "2", value: "bar"}]
 */
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
