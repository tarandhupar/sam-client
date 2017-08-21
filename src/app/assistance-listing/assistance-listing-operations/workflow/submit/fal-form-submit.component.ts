import {Component, Input} from "@angular/core";
import {FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {AlertFooterService} from "../../../../alerts/alert-footer/alert-footer.service";
import {Router} from "@angular/router";
import {FALFormService} from "../../fal-form.service";
import {AuthGuard} from "../../../../../api-kit/authguard/authguard.service";

@Component({
  selector: 'fal-form-submit',
  templateUrl: 'fal-form-submit.template.html',
  providers: [AuthGuard]
})

export class FALSubmitComponent {
  falSubmitForm: FormGroup;
  title: string;
  programId: string;
  data: any;
  successFooterAlertModel = {
    title: "Success",
    description: "Submission Successful.",
    type: "success",
    timer: 3000
  };

  errorFooterAlertModel = {
    title: "Error",
    description: "Error in Submission.",
    type: "error",
    timer: 3000
  };

  public submissionAlertConfig = {
    id: 'submission-instructions',
    type: 'warning',
    title: 'Submission Instructions',
    description: 'Please enter in a submission comment and click the "Submit to OMB" button to send your submission for OMB Review/Publication.'
  };

  constructor(private fb: FormBuilder, private alertFooterService: AlertFooterService, private router: Router, private service: FALFormService, private authGuard: AuthGuard) {
  }

  ngOnInit() {
    this.service.getFAL(this.router.url.split('/')[2]).subscribe(
      data => {
        this.data = data;
        this.authGuard.checkPermissions('submit', data);
        this.createForm();
      },
      error => {
        console.error('error retrieving dictionary data', error);
      });
  }

  createForm() {
    this.falSubmitForm = this.fb.group({
      'reason': ''
    });
  }

  onSubmitOMBClick() {
    this.programId = this.router.url.split('/')[2];
    let data = {"reason": this.falSubmitForm.controls['reason'].value};
    this.service.submitFAL(this.programId, data)
      .subscribe(api => {
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
    url = url.replace("submit", "review");
    this.router.navigateByUrl(url);
  }
}