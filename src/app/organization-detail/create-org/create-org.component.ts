import { Component, Input, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { FHService } from "../../../api-kit/fh/fh.service";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";

function validDateTime(c: FormControl) {
  let invalidError = {message: 'Date is invalid'};

  if (c.value === 'Invalid Date') {
    return invalidError;
  }
}

function isRequired(c: FormControl) {
  if(c.value === '') return {required:true};
}

@Component ({
  templateUrl: 'create-org.template.html'
})
export class OrgCreatePage {

  @ViewChildren(OrgAddrFormComponent) addrForms:QueryList<OrgAddrFormComponent>;

  @ViewChild('orgName') orgName: SamTextComponent;
  @ViewChild('orgStartDateWrapper') orgStartDateWrapper: LabelWrapper;

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
  orgObj:any = {};
  orgAddresses:any = [];
  orgType:string = "";
  orgParentId:string = "";
  fullParentPath:string = "";
  fullParentPathName:string = "";

  reviewOrgPage:boolean = false;
  createOrgPage:boolean = true;

  baseURL = "/create-organization";

  locationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  extraAddressTypes = ["Billing Address","Shipping Address"];
  orgTypeWithAddress = "Office";
  showFullDes:boolean = false;

  constructor(private builder: FormBuilder, private router: Router, private route: ActivatedRoute, private fhService: FHService, public flashMsgService:FlashMsgService) {}

  ngOnInit(){
    this.basicInfoForm = this.builder.group({
      orgName: ['', []],
      orgStartDate: ['', [validDateTime, isRequired]],
      orgDescription: ['', []],
      orgShortName: ['', []],
    });

    this.orgAddresses.push({addrModel:{addrType:"Mailing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""},showAddIcon:true});

    this.route.queryParams.subscribe(queryParams => {
      this.orgType = queryParams["orgType"];
      this.orgParentId = queryParams["parentID"];
      this.setupOrgForms(this.orgType);
      this.getOrgDetail(this.orgParentId);
    });

  }

  getOrgDetail(orgId){
    this.fhService.getOrganizationById(orgId,false,true).subscribe(
      val => {
        let orgDetail = val._embedded[0].org;
        this.fullParentPath = orgDetail.fullParentPath;
        this.fullParentPathName = orgDetail.fullParentPathName;
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

  getOrgTypeSpecialInfo(orgType){
    switch (orgType){
      case "Office":
        this.getOrgCodes(this.officeCodesForm,"FPDSCode","FPDS Code","fpdsCode");
        this.getOrgCodes(this.officeCodesForm,"ACCCode","AAC Code","aacCode");
        break;
      case "Agency": case "MajorCommand": case "SubCommand":
        this.getOrgCodes(this.agencyCodesForm,"FPDSCode","FPDS Code","fpdsCode");
        this.getOrgCodes(this.agencyCodesForm,"OMBBureauCode","OMB Code","ombAgencyCode");
        break;
      case "Department":
        this.getOrgCodes(this.deptCodesForm,"FPDSCode","FPDS Code","fpdsCode");
        this.getOrgCodes(this.deptCodesForm,"TAS2Code","TAS2 Code","tas2Code");
        this.getOrgCodes(this.deptCodesForm,"TAS3Code","TAS3 Code","tas3Code");
        this.getOrgCodes(this.deptCodesForm,"A11Code","A11 Code","a11TacCode");
        this.getOrgCodes(this.deptCodesForm,"CFDACode","CFDA Code","cfdaCode");
        this.getOrgCodes(this.deptCodesForm,"OMBAgencyCode","OMB Agency Code","ombAgencyCode");
        break;
      default:
        break;
    }
  }

  getOrgCodes(orgForm:FormGroup, codeType:string, desc:string, fieldName:string){
    this.orgInfo.push({des:desc, value:orgForm.get(codeType).value});
    this.orgObj[fieldName] = orgForm.get(codeType).value;
  }

  generateBasicOrgObj(){
    this.orgObj['name'] = this.basicInfoForm.get('orgName').value;
    this.orgObj['startDate'] = this.basicInfoForm.get('orgStartDate').value;
    this.orgObj['summary'] = this.basicInfoForm.get('orgDescription').value;
    this.orgObj['shortName'] = this.basicInfoForm.get('orgShortName').value;
    let type = this.orgType.toUpperCase();
    if(type === "SUBCOMMAND") type = "SUB COMMAND";
    if(type === "MAJORCOMMAND") type = "MAJOR COMMAND";
    this.orgObj['type'] = type;
    if (this.isAddressNeeded()){
      this.orgObj['newIsAward'] = this.indicateFundRadioModel === "Funding/Awarding"?true:false;
      this.orgObj['newIsFunding'] = this.indicateFundRadioModel === "Funding/Awarding" || this.indicateFundRadioModel == "Funding"?true:false;
      this.orgObj['orgAddresses'] = [];
      this.orgAddresses.forEach( e => {
        this.orgObj['orgAddresses'].push({
          "city": e.addrModel.city,
          "countryCode": e.addrModel.country,
          "state": e.addrModel.state,
          "streetAddress": e.addrModel.street2.length > 0 ? e.addrModel.street1 +" "+ e.addrModel.street2: e.addrModel.street1,
          "zipcode": e.addrModel.postalCode,
        });
      });
    }
  }

  setOrgStartDate(val){
    this.basicInfoForm.get('orgStartDate').setValue(val);
  }


  onReviewFormClick(){

    // Validate all the necessary fields in the organization creation form
    this.basicInfoForm.get('orgName').markAsDirty();
    this.basicInfoForm.get('orgStartDate').markAsDirty();
    this.orgName.wrapper.formatErrors(this.basicInfoForm.get('orgName'));
    this.orgStartDateWrapper.formatErrors(this.basicInfoForm.get('orgStartDate'));
    if(this.isAddressNeeded()){
      this.indicateFundRadioConfig.errorMessage = this.indicateFundRadioModel === ''? "This field cannot be empty": '';
    }

    if((!this.isAddressNeeded() || (this.isAddressNeeded() && this.isAddressFormValid() && this.indicateFundRadioModel !== '' )) && !this.basicInfoForm.invalid) {
      this.createOrgPage = false;
      this.reviewOrgPage = true;
      this.orgInfo = [];
      this.orgInfo.push({des: "Organization Name", value: this.basicInfoForm.get('orgName').value});
      this.orgInfo.push({des: "Start Date", value: this.basicInfoForm.get('orgStartDate').value});
      this.orgInfo.push({des: "Description", value: this.basicInfoForm.get('orgDescription').value});
      this.orgInfo.push({des: "Shortname", value: this.basicInfoForm.get('orgShortName').value});
      if (this.isAddressNeeded()) this.orgInfo.push({des: "Indicate Funding", value: this.indicateFundRadioModel});
      this.getOrgTypeSpecialInfo(this.orgType);
      this.generateBasicOrgObj();
    }
  }

  onEditFormClick(){
    this.createOrgPage = true;
    this.reviewOrgPage = false;
  }

  onConfirmFormClick(){
    //submit the form and navigate to the new created organization detail page
    this.fhService.createOrganization(this.orgObj,this.fullParentPath,this.fullParentPathName).subscribe(
      val => {
        this.flashMsgService.showFlashMsg();
        this.flashMsgService.isCreateOrgSuccess = true;
        this.router.navigate(['/organization-detail',val,'profile']);
      }
    );
  }

  onCancelFormClick(){
    //Navigate back to the parent organization
    this.router.navigate(['/organization-detail',this.orgParentId,'profile']);
  }

  onAddAddressForm(){
    if(this.orgAddresses.length === 2){
      let addressTypeIndex = 1;
      this.orgAddresses.forEach( e => {
        e.showAddIcon = false;
        if(e.addrModel.addrType !== "Mailing Address") addressTypeIndex = 1 - this.extraAddressTypes.indexOf(e.addrModel.addrType);
      });
      this.orgAddresses.push({addrModel:{addrType:this.extraAddressTypes[addressTypeIndex],country:"",state:"",city:"",street1:"",street2:"",postalCode:""},showAddIcon:false});

    }else{
      this.orgAddresses.push({addrModel:{addrType:"",country:"",state:"",city:"",street1:"",street2:"",postalCode:""},showAddIcon:true});
    }

  }

  onDeleteAddressForm(orgAddrModel){
    this.orgAddresses = this.orgAddresses.filter( e => {
      return orgAddrModel.addrType !== e.addrModel.addrType;
    });
    this.orgAddresses.forEach( e => {e.showAddIcon = true;});
  }

  isAddressFormValid():boolean{
    let isValid = true;
    this.addrForms.forEach( e => {if(!e.validateForm()) isValid = false;});
    return isValid;
  }

  isAddressNeeded():boolean{
    return this.orgType === this.orgTypeWithAddress;
  }

  showFullDescription(){this.showFullDes = true;}
  hideFullDescription(){this.showFullDes = false;}
}
