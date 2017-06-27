import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'requestLabel'})
export class RequestLabelPipe implements PipeTransform {
  transform(actionType:string) : string {
    let label = "";
    switch(actionType){
      case "title_request":
        label = "Pending Title Change Request";
        break;
      case "agency_request":
        label = "Pending Agency Change Request";
        break;
      case "program_number_request":
        label = "Pending Number Change Request";
        break;
      case "archive_request":
        label = "Pending Archive Request";
        break;
      case "unarchive_request":
        label = "Pending Unarchive Request";
        break;
    }
    return label;
  }
}
