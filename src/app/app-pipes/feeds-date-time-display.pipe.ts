import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment/moment';
import 'moment-timezone';

@Pipe({name: 'feedsDateTimeDsiplay'})
export class FeedsDateTimePipe implements PipeTransform {

  /**
   * If it is the same date, return Hour, Minutes and AM or PM (eg. 10:00AM)
   * If it is the same year and different date, return Month, Date, Hour, Minutes and AM or PM (eg. Jul 10 10:00AM)
   * If it is the different year, return Month, Date, Year, Hour, Minutes and AM or PM (eg. Jul 10 2016 10:00AM)
   * @param dateStr
   * @returns {string}
   */
  transform(dateStr) : any {
    let date = moment(dateStr).format('MMM DD YYYY hh:mmA');
    let now = moment().format('YYYY-MM-DD');
    if(moment(dateStr).isSame(now,'year')){
      if(moment(dateStr).isSame(now,'month') && moment(dateStr).isSame(now,'day')){
        return moment(dateStr).format('hh:mmA');
      }
      return moment(dateStr).format('MMM DD hh:mmA');
    }
    return date;
  }
}
