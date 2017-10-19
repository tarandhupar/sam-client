import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'zipCode'
})
export class ZipCodePipe implements PipeTransform {
    transform(val) {
        let newStr = val;
		if(val.length === 9)
		{
			newStr = val.substr(0, 5) + '-' + val.substr(5, 4);
		}
        return newStr;
    }
}