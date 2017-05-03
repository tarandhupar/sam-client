import { Pipe, PipeTransform } from '@angular/core';
import { groupBy } from 'lodash';

@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform(value: Array<any>, field: string): Array<any> {
    const groups = groupBy(value, field);
    return Object.keys(groups).map(key => ({ key, items: groups[key] }));
  }
}
