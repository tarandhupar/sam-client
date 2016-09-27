import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {
  transform(value:any) {
    if (value !== null) {
      // regex /\w\S*/g means any 'word'
      return value.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    return value;
  }
}
