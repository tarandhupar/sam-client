import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'timezoneLabel'})
export class TimezoneLabelPipe implements PipeTransform {
  /** TODO: ACCOUNT FOR DAYLIGHT SAVINGS TIME **/
  transform(timestamp: string): string {
    timestamp = timestamp.replace(/UTC-10:00/g, 'Hawaii');
    timestamp = timestamp.replace(/UTC-09:00/g, 'Alaska');
    timestamp = timestamp.replace(/UTC-08:00/g, 'Pacific');
    timestamp = timestamp.replace(/UTC-07:00/g, 'Mountain');
    timestamp = timestamp.replace(/UTC-06:00/g, 'Central');
    timestamp = timestamp.replace(/UTC-05:00/g, 'Eastern');

    return timestamp;
  }
}

