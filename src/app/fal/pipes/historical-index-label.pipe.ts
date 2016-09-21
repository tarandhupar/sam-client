import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'label'})
export class HistoricalIndexLabelPipe implements PipeTransform {
  transform(actionType:string) : string {
    let label = "";
    switch(actionType){
      case "agency":
        label = "Agency Changed";
      case "unarchive":
        label = "Reinstated";
      case "title":
        label = "Title Changed";
      case "archived":
        label = "Archived";
      case "program_number":
        label = "Number Changed";
      case "publish":
        label = "Published";
    }
    return label;
  }
}
