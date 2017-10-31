import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AlertFooterService} from "../../../../app-components/alert-footer/alert-footer.service";
import {FALFormService} from "../../fal-form.service";
import {FALFormViewModel} from "../../fal-form.model";
import {FALAuthGuard} from "../../../components/authguard/authguard.service";

@Component({
  selector: 'fal-publish',
  templateUrl: 'fal-publish.template.html',
  providers: [FALFormService]
})

export class FALPublishComponent implements OnInit {
  falPublishForm: FormGroup;
  falFormViewModel: FALFormViewModel;
  title: string;
  alerts = [];
  submitReason: string;
  approveProgramId: string;
  data: any;
  btnDisabled: boolean = true;
  successFooterAlertModel = {
    title: "Success",
    description: "Publish Successful.",
    type: "success",
    timer: 3000
  }

  errorFooterAlertModel = {
    title: "Error",
    description: "Error in Publish.",
    type: "error",
    timer: 3000
  }
  public publishAlertConfig = {
    id: 'publish-fal-warning',
    type: 'warning',
    title: 'Confirm Publication',
    description: 'Please add a comment as to why you are publishing and click the Publish button.'
  };


  constructor(private fb: FormBuilder, private alertFooterService: AlertFooterService, private router: Router, private service: FALFormService, private authGuard: FALAuthGuard) {
  }

  ngOnInit() {
    this.populateData();
  }

  createForm() {
    this.falPublishForm = this.fb.group({
      'ombComment': ''
    });
  }

  populateData() {
    let programId = this.router.url.split('/')[2];
    this.service.getFAL(programId).subscribe(res => {
      this.authGuard.checkPermissions('publish', res);
      this.createForm();
      this.title = res.data.title;
      if (res && res['_links'] && res['_links']['program:request:approve'] && res['_links']['program:request:approve'].href) {
        let aaproveLink = res['_links']['program:request:approve'].href;
        this.approveProgramId = aaproveLink.split('/')[5];
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

  onPublishClick() {
    this.publishSave(this.approveProgramId);
  }

  publishSave(id: string) {
    let data = {"reason": this.falPublishForm.controls['ombComment'].value};
    let workflowRequestType = '/approve';
    this.service.falWFRequestTypeProgram(id, data, workflowRequestType).subscribe(api => {
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
        this.router.navigate(['/fal/workspace']);
      },
      error => {
        console.error('error  Submitting to OMB to api', error);
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.errorFooterAlertModel)));
      });
  }

  onCancelClick() {
    let url = this.router.url;
    url = url.replace("publish", "review");
    this.router.navigateByUrl(url);
  }

  onTextChange(event) {
    if (event.target.value != null && event.target.value.trim() != '')
      this.btnDisabled = false;
    else
      this.btnDisabled = true;
  }
}

