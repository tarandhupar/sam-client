import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'fhTitleCase'})
export class FHTitleCasePipe implements PipeTransform {
  transform(phrase:string) : any {
    if (!phrase || !phrase.length) {
      return '';
    }

    var phraseArr = phrase.toLowerCase().split(" ");
    var revised = "";
    let capitalizeAll = ["u.s.","ii","iii"];
    let doNotCapitalize	= ["a", "an", "and", "as", "at", "but", "by", "etc", "for", "in", "into", "is", "nor", "of", "off", "on", "onto", "or", "so", "the", "to", "unto", "via"];
    for ( var i = 0; i < phraseArr.length; i++ ) {
      let piece = phraseArr[i];
      if (i==0) {
        piece = piece.charAt(0).toUpperCase() + piece.substring(1,piece.length);;
      }
      
      if (capitalizeAll.indexOf(piece.toLowerCase())!=-1){
        piece = piece.toUpperCase();
      }
      else if(piece.charAt(0)=="(" && piece.charAt(piece.length-1)==")"){
        piece = piece.toUpperCase();
      }
      else if(doNotCapitalize.indexOf(piece)==-1){
        piece = piece.charAt(0).toUpperCase() + piece.substring(1,piece.length);
      }
      phraseArr[i] = piece;
    }
    return phraseArr.join(" ");
  }
}
