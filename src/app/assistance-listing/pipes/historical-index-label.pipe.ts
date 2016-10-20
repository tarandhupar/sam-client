import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'historicalIndexLabel'})
export class HistoricalIndexLabelPipe implements PipeTransform {
  transform(actionType:string) : string {
    let label = "";
    switch(actionType){
      case "agency":
        label = "Agency Changed";
        break;
      case "unarchive":
        label = "Reinstated";
        break;
      case "title":
        label = "Title Changed";
        break;
      case "archived":
        label = "Archived";
        break;
      case "program_number":
        label = "Number Changed";
        break;
      case "publish":
        label = "Published";
        break;
    }
    return label;
  }
}
