import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'requestTypeLabel'})
export class RequestTypeLabelPipe implements PipeTransform {
  transform(actionType:string) : string {
    let label = "";
    switch(actionType){
      case "title_request":
        label = "Title Change Request";
        break;
      case "agency_request":
        label = "Agency Change Request";
        break;
      case "program_number_request":
        label = "CFDA Number Change Request";
        break;
      case "archive_request":
        label = "Archive Change Request";
        break;
      case "unarchive_request":
        label = "Unarchive Change Request";
        break;
    }
    return label;
  }
}
