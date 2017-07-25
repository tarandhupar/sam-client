import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'requestHistoryLabel'})
export class RequestHistoryLabelPipe implements PipeTransform {
  transform(actionType:string) : string {
    let label = "";
    switch(actionType){
      case "title_request":
        label = "Title Changed Requested";
        break;
      case "agency_request":
        label = "Agency Change Requested";
        break;
      case "program_number_request":
        label = "CFDA Number Change Requested";
        break;
      case "archive_request":
        label = "Archive Requested";
        break;
      case "unarchive_request":
        label = "Unarchive Requested";
        break;
      case "submit":
        label = "Program Submitted";
        break;
      case "retract":
        label = "Program Retraction Submitted";
        break;
      case "revise":
        label = "Program Revision Requested";
        break;
    }
    return label;
  }
}
