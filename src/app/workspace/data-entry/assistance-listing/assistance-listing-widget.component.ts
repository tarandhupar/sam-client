import { Component } from '@angular/core';
import {ProgramService} from "../../../../api-kit/program/program.service";
import * as Cookies from 'js-cookie';

@Component({
  selector: 'assistance-listing-widget',
  templateUrl: './assistance-listing-widget.template.html'
})
export class AssistanceListingWidgetComponent {
  permissions: any = {};
  cookieValue: string;
  pendingApprovalCount: any;
  pendingRequestCount: any;
  rejectedCount: any;

  constructor(private api: ProgramService) {}

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    if(this.cookieValue!=null) {
      this.api.getPermissions(this.cookieValue, 'FAL_LISTING, CREATE_FALS, FAL_REQUESTS, CREATE_RAO').subscribe(res => {
          this.permissions = res;
        },
        error => {
          console.log("Error getting permissions", error);
        });
      this.getProgramCountByStatus();
      this.getCountRequests();
    }
  }

  getProgramCountByStatus() {
    this.api.getProgramCountByStatus(this.cookieValue).subscribe(res => {
      this.pendingApprovalCount = res.content['total_pending_listing'];
      this.rejectedCount = res.content['total_rejected_listing'];
    },
    error => {
      console.log("Error getting program counts", error);
      this.pendingApprovalCount = null;
      this.rejectedCount = null;
    });
  }

  getCountRequests() {
    this.api.getCountPendingRequests(this.cookieValue).subscribe(res => {
      this.pendingRequestCount = res;
    },
    error => {
      console.log("Error getting request counts", error);
      this.pendingRequestCount = null;
    })
  }
}
