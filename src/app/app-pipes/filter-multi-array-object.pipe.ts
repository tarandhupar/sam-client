import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

/**
 * Function to return an array of matched data by an ID
 *
 * This function accept flat array of object of data or hierarchical array of objects
 *
 * @param Array values | ["2"]
 * @param Array data | [{"id": "1", "value":"foo", "children": [{"id":"11", "value": "foo 1.1"}], {"id": "2", value: "bar"} }]
 * @param String fieldName | "id" ; the field name in @param aData to search @param aValue against
 * @param isNested Boolean | true/false ; has @param aData children field to search data against
 * @param nestedFieldName String | "children" ; the field name in @param aData to search @param aValue against
 *
 * @returns Array of object | [{"id": "2", value: "bar"}]
 */
@Pipe({name: 'filterMultiArrayObject'})
export class FilterMultiArrayObjectPipe implements PipeTransform {
  transform(values: any[], data: any[], fieldName: string, isNested: boolean, nestedFieldName: string): any[] {

    let tmpArray = data;

    // nested array of objects
    if (isNested === true) {
      tmpArray = this.flattenMultiArrayObject(data, nestedFieldName);
    }

    // for each search value, filter the data to get a list of items that match the search value
    // then combine all lists of results together and flatten them, taking only unique results
    return _.uniq(_.flatMap(values, value => {
      return _.filter(tmpArray, item => {
        return value === item[fieldName];
      });
    }));
  }

  private flattenMultiArrayObject(obj: any[], nestedFieldName: string): any[] {
    // for each item in the object, add all its children and itself to the accumulator array
    return _.reduce(obj, (accumulator, item) => {
      // recursive case: flatten nested array if it exists
      if (item[nestedFieldName] && item[nestedFieldName] instanceof Array) {
        accumulator = accumulator.concat(this.flattenMultiArrayObject(item[nestedFieldName], nestedFieldName));
      }

      // base case: return current level if not nested
      return accumulator.concat(item);
    }, []); // the accumulator begins as empty []
  }
}
