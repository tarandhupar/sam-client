import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {
  transform(word:string) : any {
    if (!word || !word.length) {
      return '';
    }
    let array		= word.split(' '); // split on spaces
    let capitalized	= '';
    let doNotCapitalize	= ["a", "an", "and", "as", "at", "but", "by", "etc", "for", "in", "into", "is", "nor", "of", "off", "on", "onto", "or", "so", "the", "to", "unto", "via"];

    array.forEach((value, index) => {//$.each(array, function( index, value ) {
      // only capitalize if first word or not in doNotCapitalize array
      value = value.toLowerCase();
      if( index === 0 || doNotCapitalize.indexOf(value) === -1 ) // inArray returns -1 for false, 0 for element index in array
        capitalized += value.charAt(0).toUpperCase() + value.slice(1);
      else
        capitalized += value;

      if( array.length != (index+1) )
        capitalized += ' '; // add a space if not end of array
    });
    return capitalized;
  }
}
