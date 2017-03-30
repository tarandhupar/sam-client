import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'busCategories'
})
export class BusCategoriesPipe implements PipeTransform {
  transform(val) : any {
    let busTypes = '';
    for (let key in val) {
		if(val[key] === 'YES')
		{
			if(busTypes != '')
			{
				busTypes = busTypes + ', ' + key;
			}
			else
			{
				busTypes = key;
			}
			
		}
    }
    return busTypes;
  }
}