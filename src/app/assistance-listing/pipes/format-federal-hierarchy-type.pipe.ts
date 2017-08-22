import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'formatFederalHierarchyType'})
export class FormatFederalHierarchyType implements PipeTransform {
  transform(type:string) : string {
    let newType = type;
    if (type === 'DEPARTMENT'){
      newType = 'Department/Ind. Agency';
    } else if(type === 'AGENCY'){
      newType = 'Sub-tier';
    } else if (type === 'OFFICE'){
      newType = 'Office'
    }
    return newType;
  }
}
