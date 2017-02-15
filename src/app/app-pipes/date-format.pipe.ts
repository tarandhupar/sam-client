import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({name: 'dateFormat'})
export class DateFormatPipe implements PipeTransform {
  transform(datetime:any, format:string) : any {
    if (datetime == null) {
      return null;
    }

    return moment(datetime).format(format);
  }
}
