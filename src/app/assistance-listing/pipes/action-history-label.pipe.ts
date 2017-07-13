import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'actionHistoryLabel'})
export class ActionHistoryLabelPipe implements PipeTransform {
  transform(actionType:string) : string {
    let label = "";
    switch(actionType){
      case "retract":
        label = "Program Retracted";
        break;
      case "publish":
        label = "Revision Published";
        break;
      case "reject_program":
        label = "Program Rejected";
        break;
      case "send_omb":
        label = "send_omb";
        break;
      case "send_gsa":
        label = "send_gsa";
        break;
      case "archive_reject":
        label = "Archive Request Rejected";
        break;
      case "archive":
        label = "Program Archived";
        break;
      case "archive_cancel":
        label = "Archive Request Cancelled";
        break;
      case "expire_omb":
        label = "expire_omb";
        break;
      case "title_reject":
        label = "Title Request Rejected";
        break;
      case "title":
        label = "Title Changed";
        break;
      case "title_cancel":
        label = "Title Request Cancelled";
        break;
      case "agency_reject":
        label = "Agency Change Request Rejected";
        break;
      case "agency":
        label = "Agency Changed";
        break;
      case "agency_cancel":
        label = "Agency Change Request Cancelled";
        break;
      case "program_number_reject":
        label = "Program Number Request Rejected";
        break;
      case "program_number":
        label = "Program Number Changed";
        break;
      case "program_number_cancel":
        label = "Program Number Request Cancelled";
        break;
      case "omb_extension":
        label = "omb_extension";
        break;
      case "unarchive":
        label = "Program Unarchived";
        break;
      case "unarchive_reject":
        label = "Unarchive Request Rejected";
        break;
      case "unarchive_cancel":
        label = "Unarchive Request Cancelled";
        break;
    }
    return label;
  }
}
