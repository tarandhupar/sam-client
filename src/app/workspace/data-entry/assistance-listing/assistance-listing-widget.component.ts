import { Component } from '@angular/core';
import { ProgramService } from "../../../../api-kit/program/program.service";
import * as Cookies from 'js-cookie';
import { FALAuthGuard } from "../../../assistance-listing/components/authguard/authguard.service";
import { FALFormService } from '../../../assistance-listing/assistance-listing-operations/fal-form.service';
import { FALFormErrorService } from '../../../assistance-listing/assistance-listing-operations/fal-form-error.service';

@Component({
  providers: [ProgramService, FALAuthGuard, FALFormErrorService, FALFormService],
  selector: 'assistance-listing-widget',
  templateUrl: './assistance-listing-widget.template.html'
})
export class AssistanceListingWidgetComponent {
  permissions: any = {};
  userPermissions: any = {};
  cookieValue: string;
  pendingApprovalCount: any;
  pendingRequestCount: any;
  rejectedCount: any;
  draftReviewCount: any;

  constructor(private api: ProgramService, private falAuthGuard: FALAuthGuard) {}

  ngOnInit() {
    this.getUserPermissions();
  }

  getUserPermissions() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    if(this.cookieValue!=null) {
      this.api.getPermissions(this.cookieValue, 'FAL_REQUESTS, ORG_LEVELS').subscribe(res => {
          this.permissions = res;
        },
        error => {
          console.log("Error getting permissions", error);
        });
      this.api.getPermissions(this.cookieValue).subscribe(res => {
          this.userPermissions = res;
        },
        error => {
          console.log("Error getting permissions", error);
        });
      this.getProgramCountByStatus();
    }
  }

  getProgramCountByStatus() {
    this.api.runProgram({Cookie: this.cookieValue, size: 1}).subscribe(res => {
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
        case 'total_draft_review_listing':
          this.draftReviewCount = data[property]['count'];
          break;
        default:
          break;
      }
    }
  }
  downloadFile() {
    let file;
    let url;
    this.getTemplateSub = this.api.getTemplate(this.cookieValue).subscribe(data => {
        file = new Blob([data.blob()]);
        if (window.navigator.msSaveOrOpenBlob) { // for IE and Edge
          window.navigator.msSaveBlob(file , 'Assistance_Listing_Template.doc');
        } else {
          let link = document.createElement("a");
          link.id = 'downloadlink';
          url = URL.createObjectURL(file);
          link.download = 'Assistance_Listing_Template.doc';
          link.href = url;
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }

      } ,
      error => console.log("Error downloading the file.") ,
      () => console.log('Completed file download.'));
  }
}
