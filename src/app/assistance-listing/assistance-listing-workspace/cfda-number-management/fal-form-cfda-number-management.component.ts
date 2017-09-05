import {Component, OnInit} from "@angular/core";
import {ProgramService} from "../../../../api-kit/program/program.service";
import {FALFormService} from "../../assistance-listing-operations/fal-form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FHService} from "../../../../api-kit/fh/fh.service";
import {FormGroup, FormBuilder} from "@angular/forms";
import {AlertFooterService} from "../../../alerts/alert-footer/alert-footer.service";
import {Location} from "@angular/common";
import * as Cookies from 'js-cookie';
import {falCustomValidatorsComponent} from "../../validators/assistance-listing-validators";

interface CFDANumberConfigChangeModel {
  startValue: string,
  endValue: string,
  manual: string,
  organizationId: string
}

@Component({
  providers: [ProgramService, FALFormService],
  templateUrl: 'fal-form-cfda-number-management.template.html',
  selector: 'fal-form-cfda-number-management'
})

export class CFDANumberManagementComponent implements OnInit{
  cfdaNumberConfigForm: FormGroup;
  organization: any;
  pageReady: boolean = false;
  buttonType: string = 'default';
  cookieValue:string;
  numberAlertShow:boolean = false;
  notifyFooterAlertModel = {
    title: "Success",
    description: "Successfully changed configuration.",
    type: "success",
    timer: 3000
  };

  public assignmentOptions = [
    { value: 'false', label: 'Automatic', name: 'automaticAssignemt'},
    { value: 'true', label: 'Manual', name: 'manualAssignment'}
  ];

  constructor(private fb: FormBuilder,
              private location: Location,
              private fhService:FHService,
              private programService: ProgramService,
              private activatedRoute: ActivatedRoute,
              private alertFooterService: AlertFooterService,
              private router: Router
  ){

  }

  ngOnInit(){
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    if (this.cookieValue === null || this.cookieValue === undefined) {
      this.router.navigate(['signin']);
    }

    if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
      this.router.navigate(['accessrestricted']);
    }

    this.fhService.getOrganizationById(this.activatedRoute.snapshot.params['id'], false, false).subscribe(res =>{
      this.organization = res['_embedded'][0]['org'];
      this.createCFDANumberConfigForm();
    });
  }

  createCFDANumberConfigForm(){
    this.pageReady = true;
    this.cfdaNumberConfigForm = this.fb.group({
      lowNumber:['', falCustomValidatorsComponent.numberCheck],
      highNumber: ['', falCustomValidatorsComponent.numberCheck],
      assignemnt: ''
    });
  }

  public cancelCFDANumberConfigChange() {
    this.location.back();
  }

  private prepareCFDANumberChangeData(): CFDANumberConfigChangeModel {
    let preparedData: CFDANumberConfigChangeModel = {
      startValue: this.cfdaNumberConfigForm.get('lowNumber').value,
      endValue: this.cfdaNumberConfigForm.get('highNumber').value,
      manual: this.cfdaNumberConfigForm.get('assignemnt').value,
      organizationId: this.activatedRoute.snapshot.params['id'],
    };
    return preparedData;
  }

  public submitCFDANumberConfigChange() {
    if (this.cfdaNumberConfigForm.valid) {
      //disable button's event
      this.buttonType = 'disabled';
      if(parseInt(this.cfdaNumberConfigForm.get('highNumber').value) > parseInt(this.cfdaNumberConfigForm.get('lowNumber').value)) {
        this.numberAlertShow = false;
        this.programService.saveCFDAConfiguration(this.activatedRoute.snapshot.params['id'], this.prepareCFDANumberChangeData(), this.cookieValue).subscribe(api => {
            this.notifyFooterAlertModel.description = "CFDA Number Configuration Changed";
            this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyFooterAlertModel)));
            this.router.navigate(['/fal/workspace/cfda-numbers']);
          },
          error => {
            console.error('error changing configuration', error);
            this.notifyFooterAlertModel.title = "Error";
            this.notifyFooterAlertModel.type = "error";
            this.notifyFooterAlertModel.description = "An error has occurred please contact your administrator.";
            this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyFooterAlertModel)));
            this.buttonType = 'default';
          });
      }else{
        this.numberAlertShow = true;
        this.buttonType = 'default';
        for (let control in this.cfdaNumberConfigForm.controls) {
          this.cfdaNumberConfigForm.controls[control].markAsDirty();
          this.cfdaNumberConfigForm.controls[control].updateValueAndValidity();
        }
      }
    } else {
      for (let control in this.cfdaNumberConfigForm.controls) {
        this.cfdaNumberConfigForm.controls[control].markAsDirty();
        this.cfdaNumberConfigForm.controls[control].updateValueAndValidity();
      }
    }
  }

}
