import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'requestHistoryLabel'})
export class RequestHistoryLabelPipe implements PipeTransform {
  transform(actionType:string) : string {
    let label = "";
    switch(actionType){
      case "title_request":
        label = "Title Change Requested";
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
      case "submit": //because we're hiding send_omb from the list of history action -> renaming submit label to match send_omb label
        label = "Submitted to OMB";
        break;
      case "retract":
        label = "Retraction Submitted";
        break;
      case "revise":
        label = "Revision Requested";
        break;
    }
    return label;
  }
}
