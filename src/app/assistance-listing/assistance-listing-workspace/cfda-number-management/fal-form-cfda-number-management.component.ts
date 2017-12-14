import {Component, OnInit} from "@angular/core";
import {ProgramService} from "../../../../api-kit/program/program.service";
import {FALFormService} from "../../assistance-listing-operations/fal-form.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FHService} from "../../../../api-kit/fh/fh.service";
import {FormGroup, FormBuilder} from "@angular/forms";
import {AlertFooterService} from "../../../app-components/alert-footer/alert-footer.service";
import {Location} from "@angular/common";
import * as Cookies from 'js-cookie';
import {falCustomValidatorsComponent} from "../../validators/assistance-listing-validators";
import {IBreadcrumb} from "../../../../sam-ui-elements/src/ui-kit/types";

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
  buttonDisabled: boolean = false;
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
  isCfdaCodeRestricted: boolean = false;
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'CFDA Number Assignment', url: '/fal/workspace/cfda-numbers'},
    { breadcrumb: 'Edit CFDA Number Assignment'}
  ];

  public assignmentOptions = [
    { value: 'false', label: 'Automatic', name: 'automaticAssignment'},
    { value: 'true', label: 'Manual', name: 'manualAssignment'}
  ];

  public assignmentModel: any;

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

    this.programService.getPermissions(this.cookieValue, 'CFDA_NUMBER', this.activatedRoute.snapshot.params['id']).subscribe(res => {
      if (res.MANAGE_CFDA_NUMBER == false){
        this.router.navigate(['/403']);
      } else {
        this.fhService.getOrganizationById(this.activatedRoute.snapshot.params['id'], false, false).subscribe(res =>{
          this.organization = res['_embedded'][0]['org'];
          this.programService.getFederalHierarchyConfiguration(this.activatedRoute.snapshot.params['id'], this.cookieValue).subscribe(res => {
            let programNumberAuto = res.programNumberAuto != null ? res.programNumberAuto : true;
            let programNumberLow = res.programNumberLow != null ? res.programNumberLow : 0;
            let programNumberHigh = res.programNumberHigh != null ? res.programNumberHigh : 999;
            this.initCFDANumberConfigForm(programNumberAuto, programNumberLow, programNumberHigh);
          }, err => {
            this.initCFDANumberConfigForm(true, 0, 999);
            console.log("Error getting federal hierarchy configuration: ", err);
          });
        }, err => {
          console.log("Error getting organization: ", err);
        });
      }
    }, err => {
      this.router.navigate(['/403']);
    });
  }

  initCFDANumberConfigForm(programNumberAuto, programNumberLow, programNumberHigh){
    this.programService.isCfdaCodeRestricted(this.activatedRoute.snapshot.params['id'], this.cookieValue).subscribe(res => {
      this.createCFDANumberConfigForm(programNumberAuto, programNumberLow, programNumberHigh, (res != null && res.content != null) ? res.content.isRestricted : false);
      this.isCfdaCodeRestricted = (res != null && res.content != null) ? res.content.isRestricted : false;
    }, error => {
      this.createCFDANumberConfigForm(programNumberAuto, programNumberLow, programNumberHigh, false);
      this.isCfdaCodeRestricted = false;
    });
  }

  createCFDANumberConfigForm(programNumberAuto, programNumberLow, programNumberHigh, disabled: boolean = true){
      this.pageReady = true;
      this.cfdaNumberConfigForm = this.fb.group({
        lowNumber:[programNumberLow, falCustomValidatorsComponent.numberCheck],
        highNumber: [programNumberHigh, falCustomValidatorsComponent.numberCheck],
        assignment: (!programNumberAuto).toString()
      });

      if (disabled) {
        this.cfdaNumberConfigForm.controls['lowNumber'].disable();
        this.cfdaNumberConfigForm.controls['highNumber'].disable();
        this.cfdaNumberConfigForm.controls['assignment'].disable();
      }
  }

  public cancelCFDANumberConfigChange() {
    this.location.back();
  }

  private prepareCFDANumberChangeData(): CFDANumberConfigChangeModel {
    let preparedData: CFDANumberConfigChangeModel = {
      startValue: this.cfdaNumberConfigForm.get('lowNumber').value,
      endValue: this.cfdaNumberConfigForm.get('highNumber').value,
      manual: this.cfdaNumberConfigForm.get('assignment').value,
      organizationId: this.activatedRoute.snapshot.params['id'],
    };
    return preparedData;
  }

  public submitCFDANumberConfigChange() {
    if (this.cfdaNumberConfigForm.valid) {
      this.buttonDisabled = true;
      //disable button's event
      this.buttonType = 'disabled';
      if(parseInt(this.cfdaNumberConfigForm.get('highNumber').value) > parseInt(this.cfdaNumberConfigForm.get('lowNumber').value)) {
        this.numberAlertShow = false;
        this.programService.saveCFDAConfiguration(this.activatedRoute.snapshot.params['id'], this.prepareCFDANumberChangeData(), this.cookieValue)
          .subscribe(api => {
            this.notifyFooterAlertModel.description = "CFDA Number Configuration Changed";
            this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyFooterAlertModel)));
            this.router.navigate(['/fal/workspace/cfda-numbers']);
          },
          (error: Response) => {
            this.buttonDisabled = false;
            console.error('error changing configuration', error);
            this.notifyFooterAlertModel.title = "Error";
            this.notifyFooterAlertModel.type = "error";

            let data: any = error.json();
            if (data.errorCode != null && data.message != null) {
              this.notifyFooterAlertModel.description = data.message;
            } else {
              this.notifyFooterAlertModel.description = "An error has occurred please contact your administrator.";
            }

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
