import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phone'
})
export class PhonePipe implements PipeTransform {
    transform(val) {
        let newStr = '';
		if(val.length === 10)
		{
			newStr = '(' + val.substr(0, 3) + ')' + val.substr(3, 3) + '-' + val.substr(6, 4);
		}
		else if(val.length === 7)
		{
			newStr = val.substr(0, 3) + '-' + val.substr(3, 4);
		}
		else if(val.length === 11)
		{
			newStr = val.substr(0, 1) + '-(' + val.substr(1, 3) + ')' + val.substr(4, 3) + '-' + val.substr(7, 4);
		}
        return newStr;
    }
}