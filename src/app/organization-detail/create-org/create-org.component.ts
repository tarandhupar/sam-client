import { Component, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import { LocationService } from "api-kit/location/location.service";
import * as moment from 'moment/moment';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { SamDateComponent } from 'sam-ui-kit/form-controls/date/date.component';
import { SamSelectComponent } from 'sam-ui-kit/form-controls/select/select.component';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { SamTextareaComponent } from 'sam-ui-kit/form-controls/textarea/textarea.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';

function validDateTime(c: FormControl) {
  let error = {
    validDateTime: {
      message: 'Date is invalid'
    }
  };

  if (c.value === 'Invalid Date') {
    return error;
  }
}


@Component ({
  templateUrl: 'create-org.template.html'
})
export class OrgCreatePage {



  @ViewChild('orgName') orgName: SamTextComponent;
  @ViewChild('orgStartDateWrapper') orgStartDateWrapper: LabelWrapper;
  @ViewChild('orgDescription') orgDescription: SamTextareaComponent;
  @ViewChild('orgShortName') orgShortName: SamTextComponent;
  @ViewChild('orgFPDSCode') FPDSCode: SamTextComponent;
  @ViewChild('orgAACCode') ACCCode: SamTextComponent;
  // @ViewChild('MailAddrStreetAddr1') MailAddrStreetAddr1: SamTextComponent;
  // @ViewChild('MailAddrStreetAddr2') MailAddrStreetAddr2: SamTextComponent;
  // @ViewChild('MailAddrCity') MailAddrCity: SamTextComponent;
  // @ViewChild('MailAddrPostalCode') MailAddrPostalCode: SamTextComponent;
  // @ViewChild('MailAddrState') MailAddrState: SamTextComponent;

  // Indicate Funding radio group
  indicateFundRadioModel:any = '';
  indicateFundRadioConfig = {
    options: [
      {value: 'Funding/Awarding', label: 'Funding/Awarding', name: 'Funding/Awarding'},
      {value: 'Funding', label: 'Funding', name: 'Funding'},
      {value: 'Other', label: 'Other', name: 'Other'},
    ],
    name: 'indicate-funding',
    label: 'Indicate Funding',
    errorMessage: ''
  };

  basicInfoForm: FormGroup;
  officeCodesForm: FormGroup;
  agencyCodesForm: FormGroup;
  deptCodesForm: FormGroup;

  orgInfo:any = [];
  orgAddresses:any = [];
  orgType:string = "";
  orgParentId:string = "";


  reviewOrgPage:boolean = false;
  createOrgPage:boolean = true;

  baseURL = "/create-organization";

  locationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };
  countryOutput:any;
  stateOutput:any;
  cityOutput:any;

  constructor(private builder: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(){
    this.basicInfoForm = this.builder.group({
      orgName: ['', []],
      orgStartDate: ['', [validDateTime]],
      orgDescription: ['', []],
      orgShortName: ['', []],
    });

    this.orgAddresses.push({orgAddrTypeSelected:true, orgAddrType:"Mailing Address"});

    this.route.queryParams.subscribe(queryParams => {
      this.orgType = queryParams["orgType"];
      this.orgParentId = queryParams["parentID"];
      this.setupOrgForms(this.orgType);
    });

  }

  //Set up organization specific forms according to the org type
  setupOrgForms(orgType){
    switch (orgType){
      case "Office":
          this.officeCodesForm = this.builder.group({
            FPDSCode: ['', []],
            ACCCode: ['', []],
          });
            break;
      case "Agency": case "MajorCommand": case "SubCommand":
          this.agencyCodesForm = this.builder.group({
            FPDSCode: ['', []],
            OMBBureauCode: ['', []],
          });
            break;
      case "Department":
          this.deptCodesForm = this.builder.group({
            FPDSCode: ['', []],
            TAS2Code: ['', []],
            TAS3Code: ['', []],
            A11Code: ['', []],
            CFDACode: ['', []],
            OMBAgencyCode: ['', []],
          });
            break;
      default:
            break;
    }
  }

  setOrgStartDate(val){
    this.basicInfoForm.get('orgStartDate').setValue(val);
  }


  onReviewFormClick(){
    // Validate all the necessary fields in the organization creation form
    console.log(this.basicInfoForm.get('orgName').value);
    console.log(this.basicInfoForm.get('orgStartDate').value);
    console.log(this.basicInfoForm.get('orgDescription').value);
    console.log(this.basicInfoForm.get('orgShortName').value);
    console.log(this.indicateFundRadioModel);
    console.log(this.countryOutput);
    console.log(this.cityOutput);
    console.log(this.stateOutput);
    this.orgInfo = [];
    this.orgInfo.push({des:"Organization Name", value:this.basicInfoForm.get('orgName').value});
    this.orgInfo.push({des:"Start Date", value:this.basicInfoForm.get('orgStartDate').value});
    this.orgInfo.push({des:"Description", value:this.basicInfoForm.get('orgDescription').value});
    this.orgInfo.push({des:"Shortname", value:this.basicInfoForm.get('orgShortName').value});
    this.orgInfo.push({des:"Indicate Funding", value:this.indicateFundRadioModel});


    this.createOrgPage = false;
    this.reviewOrgPage = true;
  }

  onEditFormClick(){
    this.createOrgPage = true;
    this.reviewOrgPage = false;
  }

  onConfirmFormClick(){
    //submit the form and navigate to the new created organization detail page
    this.router.navigate(['/organization-detail',this.orgParentId,'profile']);
  }

  onCancelFormClick(){
    //Navigate back to the parent organization
    this.router.navigate(['/organization-detail',this.orgParentId,'profile']);
  }

  onAddAddressForm(){
    this.orgAddresses.push({orgAddrTypeSelected:false, orgAddrType:""});
  }

  onDeleteAddressForm(orgAddressType){
    this.orgAddresses = this.orgAddresses.filter( e => {
      console.log(e.orgAddrType);
      return orgAddressType !== e.orgAddrType;
    });
  }

}
