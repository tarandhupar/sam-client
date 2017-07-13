import { Component, Input, OnInit } from '@angular/core';
import { UserAccessService } from "api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";

@Component({
  selector: 'pending-requests',
  templateUrl:'pending-requests.template.html'
})
export class PendingRequestsComponent  implements OnInit {
  @Input() requests: Array<PendingRequest> = [];
  @Input() hideCancel: boolean = false;

  public areRequestsVisible = true;

  constructor(
    private userAccessService: UserAccessService,
    private footerAlert: AlertFooterService
  ){ }

  ngOnInit( ){
    //console.log(this.requests);
  }

  trimRequest(message) {
    if (message.length > 70) {
      return message.slice(0, 70) + '...';
    } else {
      return message;
    }
  }

  onCaretClick() {
    this.areRequestsVisible = !this.areRequestsVisible;
  }

  onCancelRequestClick(req, i) {
    let newStatus = {
      status: 'cancel',
    };
    this.userAccessService.updateRequest(req.id, newStatus).subscribe(
      res => {
        this.requests.splice(i, 1);
        this.footerAlert.registerFooterAlert({
            title:"Request canceled.",
            description:"Request for access successfully canceled.",
            type:'success',
            timer:3000
        });
      },
      err => {
        this.footerAlert.registerFooterAlert({
          title:"Error.",
          description:"Unable to cancel request.",
          type:'error',
          timer:3000
        });
      }
    );
  }

}

export interface PendingRequest {
  id: any,
  domain: string,
  createdDate: string,
  requestorMessage: string,
};
