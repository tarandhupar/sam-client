import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AlertFooterService} from "../../../../app-components/alert-footer/alert-footer.service";
import {FALFormService} from "../../fal-form.service";
import {FALFormViewModel} from "../../fal-form.model";
import {FALAuthGuard} from "../../../components/authguard/authguard.service";
import {IBreadcrumb} from "../../../../../sam-ui-elements/src/ui-kit/types";
import {PageConfig} from "../../../../../sam-ui-elements/src/ui-kit/layout/types";

@Component({
  selector: 'reject-fal',
  templateUrl: 'reject-fal.template.html',
  providers: [FALFormService]
})

export class RejectFALComponent implements OnInit {
  rejectALForm: FormGroup;
  processing: boolean = false;
  falFormViewModel: FALFormViewModel;
  title: string;
  alerts = [];
  submitReason: string;
  rejectProgramId: string;
  data: any;
  btnDisabled: boolean = true;
  successFooterAlertModel = {
    title: "Success",
    description: "Rejection Successful.",
    type: "success",
    timer: 3000
  }

  errorFooterAlertModel = {
    title: "Error",
    description: "Error in Rejection.",
    type: "error",
    timer: 3000
  }
  description = 'Please add a comment as to why you are rejecting the Assistance Listing and click the Reject button.';
  crumbs: Array<IBreadcrumb> = [];
  private options = {
    page: <PageConfig>{
      badge: {
        attached: 'top right'
      }
    }
  };


  constructor(private fb: FormBuilder, private alertFooterService: AlertFooterService, private router: Router, private service: FALFormService, private authGuard: FALAuthGuard) {
  }

  ngOnInit() {
    this.populateData();
  }

  createForm() {
    this.rejectALForm = this.fb.group({
      'ombComment': ''
    });
  }

  populateData() {
    let programId = this.router.url.split('/')[2];
    this.service.getFAL(programId).subscribe(res => {
      this.authGuard.checkPermissions('reject', res);
      this.createForm();
      this.title = res.data.title;
      this.setBreadCrumbs(this.title);
      if (res && res['_links'] && res['_links']['program:request:reject'] && res['_links']['program:request:reject'].href) {
        let rejectLink = res['_links']['program:request:reject'].href;
        this.rejectProgramId = rejectLink.split('/')[5];
        if (res && res['_links'] && res['_links']['program:request:action:review']) {
          if (res && res['_links'] && res['_links']['program:request:action:review'] && res['_links']['program:request:action:review'].href) {
            let href = res['_links']['program:request:action:review'].href;
            this.service.getSubmitReason(href.substring(href.lastIndexOf("/") + 1)).subscribe(res => {
              this.submitReason = res.reason;
            });
          }
        }
      }
      this.data = res;
    });
  }

  onRejectClick() {
    this.rejectSave();
  }

  rejectSave() {
    let data = {"reason": this.rejectALForm.controls['ombComment'].value};
    let workflowRequestType = '/reject';
    this.btnDisabled = true;
    this.processing = true;
    this.service.falWFRequestTypeProgram(this.rejectProgramId, data, workflowRequestType).subscribe(api => {
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
        this.router.navigate(['/fal/workspace']);
      },
      error => {
        this.btnDisabled = false;
        this.processing = false;
        console.error('error  Submitting to OMB to api', error);
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.errorFooterAlertModel)));
      });
  }

  onCancelClick() {
    this.setNavigation();
  }

  onTextChange(event) {
    if (event.target.value != null && event.target.value.trim() != '')
      this.btnDisabled = false;
    else
      this.btnDisabled = true;
  }

  setBreadCrumbs(title) {
    this.crumbs = [
      {breadcrumb: 'Workspace', url: '/workspace'},
      {breadcrumb: 'Assistance Listings', urlmock: true},
      {breadcrumb: title, urlmock: true},
      {breadcrumb: 'Reject Listing', urlmock: false}
    ];
  }

  breadcrumbHandler(event) {
    this.breadCrumbNavigation(event);
  }

  breadCrumbNavigation(event) {
    if (event === 'Assistance Listings') {
      this.router.navigateByUrl('fal/workspace')
    } else {
      this.setNavigation();
    }
  }

  setNavigation() {
    let url = this.router.url;
    url = url.replace("reject", "review");
    this.router.navigateByUrl(url);
  }
}

