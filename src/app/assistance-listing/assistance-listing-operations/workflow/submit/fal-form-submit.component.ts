import {Component, Input} from "@angular/core";
import {FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {AlertFooterService} from "../../../../app-components/alert-footer/alert-footer.service";
import {Router} from "@angular/router";
import {FALFormService} from "../../fal-form.service";
import {FALAuthGuard} from "../../../components/authguard/authguard.service";

@Component({
  selector: 'fal-form-submit',
  templateUrl: 'fal-form-submit.template.html'
})

export class FALSubmitComponent {
  falSubmitForm: FormGroup;
  title: string;
  programId: string;
  data: any;
  processing: boolean = false;
  btnDisabled: boolean = true;
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

  constructor(private fb: FormBuilder, private alertFooterService: AlertFooterService, private router: Router, private service: FALFormService, private authGuard: FALAuthGuard) {
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
    this.btnDisabled = true;
    this.processing = true;
    this.programId = this.router.url.split('/')[2];
    let data = {"reason": this.falSubmitForm.controls['reason'].value};
    this.service.submitFAL(this.programId, data)
      .subscribe(api => {
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
    let url = this.router.url;
    url = url.replace("submit", "review");
    this.router.navigateByUrl(url);
  }

  onTextChange(event) {
    if (event.target.value != null && event.target.value.trim() != '')
      this.btnDisabled = false;
    else
      this.btnDisabled = true;
  }
}
