import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'datex'
})
/*This Pipe is a workaround for the 'Invalid Date' for pipe 'DatePipe' error in Internet Explorer*/
export class DatexPipe implements PipeTransform {
    transform(value: string, format: string = ""): string {
        if (!value || value==="") return "";
        return moment(value).format(format);
    }
}