import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'status'})
export class StatusPipe implements PipeTransform {
  transform(status:string) : string {
    let label = "";
    switch(status){
      case "rejected":
        label = "Rejected";
        break;
      case "pending":
        label = "Pending";
        break;
      case "draft":
        label = "Draft";
        break;
      case "draft_review":
        label = "Draft Review";
        break;
    }
    return label;
  }
}
