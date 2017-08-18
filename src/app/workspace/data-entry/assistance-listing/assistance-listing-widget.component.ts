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
    }
  }

  getProgramCountByStatus() {
    this.api.runProgram({Cookie: this.cookieValue, size: 0}).subscribe(res => {
      if(res._embedded && res._embedded.facets) {
        for(var facet of res._embedded.facets) {
          switch(facet['name']) {
            case 'status':
                  this.setCounts(facet['buckets']);
                  break;
            case 'pendingChangeRequest':
                  this.setCounts(facet['buckets']);
                  break;
          }
        }
      }
    },
    error => {
      console.log("Error getting program counts", error);
      this.pendingApprovalCount = null;
      this.rejectedCount = null;
      this.pendingRequestCount = null;
    });
  }

  setCounts(data) {
    for(var property in data){

      switch(data[property]['name']){
        case 'total_rejected_listing':
          this.rejectedCount = data[property]['count'];
          break;
        case 'total_pending_listing':
          this.pendingApprovalCount = data[property]['count'];
          break;
        case 'total_change_requests':
          this.pendingRequestCount = data[property]['count'];
          break;
        default:
          break;
      }
    }
  }
}
