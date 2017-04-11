import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment/moment';
import 'moment-timezone';

@Pipe({name: 'dateFormat'})
export class DateFormatPipe implements PipeTransform {
  transform(datetime:any, format:string) : any {
    if (datetime == null) {
      return null;
    }
    if (format.includes('z')){
      return moment(datetime).tz(moment.tz.guess()).format(format)
    } else {
      return moment(datetime).format(format);
    }
  }
}
