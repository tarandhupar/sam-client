import { Component, ViewChild, ViewChildren, QueryList, NgZone } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { AACRequestService } from 'api-kit/aac-request/aac-request.service';
import { FHService } from 'api-kit/fh/fh.service';
import { IAMService } from "api-kit/iam/iam.service";
import { Observable } from "rxjs";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";

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
  templateUrl: 'AAC-request.template.html',
})
export class AACRequestPage {

  @ViewChildren(OrgAddrFormComponent) addrForms:QueryList<OrgAddrFormComponent>;

  // Needed if it is a state/local office selected
  @ViewChild('stateOfficeName') stateOfficeName: SamTextComponent;

  // Needed if it is a contractor selected
  @ViewChild('contractName') contractorName: SamTextComponent;
  @ViewChild('contractNum') contractNum: SamTextComponent;
  @ViewChild('contractCAGECode') contractCAGECode: SamTextComponent;
  @ViewChild('contractAdmin') contractAdmin: SamTextComponent;
  @ViewChild('contractorExpireDateWrapper') contractorExpireDateWrapper: LabelWrapper;

  // Needed for fpds report form
  @ViewChild('agencyCode') agencyCode: SamTextComponent;
  @ViewChild('cgacCode') cgacCode: SamTextComponent;

  private crumbs: Array<IBreadcrumb> = [];

  org: any;
  orgId: string = '';
  l1Org: any;
  l2Org: any;
  isProcurementAAC: boolean = true;
  aacTypeRadioModel:any = '';
  aacTypeRadioConfig = {
    options: [
      {value: 'single', label: 'Single AAC Request', name: 'single'},
      {value: 'multiple', label: 'Multiple AAC Request (Bulk Upload)', name: 'multiple'},
    ],
    name: 'aacType',
    label: 'Is the request a single AAC or multiple AACs?',
    errorMessage: ''
  };

  aacExistRadioModel:any = 'No';
  aacExistRadioConfig = {
    options: [
      {value: 'Yes', label: 'Yes', name: 'Yes'},
      {value: 'No', label: 'No', name: 'No'},
    ],
    name: 'aacExistence',
    label: 'Does an AAC exist for this organization?',
    errorMessage: ''
  };

  aacOfficeRadioModel:any = '';
  aacOfficeConfig = {
    options: [],
    name: 'aacOffice',
    label: 'Is the request for a Federal Office, State/Local Office or Contractor?',
    errorMessage: ''
  };
  aacStateOrgName:string = '';
  aacFederalOrgName:any;
  aacFederalOrgNameErrorMsg:string = '';

  aacReasonCbxModel:any = [];
  aacReasonCbxConfig = {
    options: [],
    name: 'aacReason',
    label: 'Provide purpose for AAC Request:',
    errorMessage: ''
  };

  hideBillingForm = false;
  hideShippingForm = false;
  billingAddrFillCbxModel:any = [];
  shippingAddrFillCbxModel:any = [];
  duplicateAddrCbxConfig = {
    options: [
      {value: 'same as mailing address', label: 'Same as Mailing Address', name: 'Same as Mailing Address'},
    ],
    name: 'duplicate-address-filling',
    label: '',
    errorMessage: ''
  };

  reasonValueMap: any = {};
  addrTypePerReason:any = [];
  aacOfficeInfo:any = [];
  orgAddresses:any = [];
  mailAddr:any = {addrType:"Mailing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  billAddr:any = {addrType:"Billing Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  shipAddr:any = {addrType:"Shipping Address",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  emptyAddrObj:any = {addrType:"",country:"",state:"",city:"",street1:"",street2:"",postalCode:""};
  commonAddr:any = {};
  stateOfficeForm:FormGroup;
  contractorForm:FormGroup;
  fpdsReportForm:FormGroup;
  aacObj:any = {};
  requestIsEdit = true;
  requestIsReview = false;
  requestIsConfirm = false;
  successAlertMsg = false;

  user = null;
  isSignedIn = false;

  dataLoaded: boolean = false;
  routerEventSubscription;

  constructor(private builder:FormBuilder,
              private aacRequestService:AACRequestService,
              private iamService: IAMService,
              private zone: NgZone,
              private route: ActivatedRoute,
              private _router: Router,
              private capitalizePipe: CapitalizePipe,
              private fhService: FHService){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.orgId = params['orgId'];
        this.fhService.getOrganizationById(this.orgId, false, true).subscribe(data => {
          this.org = data['_embedded'][0].org;
          if(this.org.level !== 3){
            this._router.navigateByUrl('/404');
          }else{
            this.crumbs.push({ url: '/organization-detail/'+this.orgId, breadcrumb: this.capitalizePipe.transform(this.org.name) });
            this.crumbs.push({ breadcrumb: 'Request AAC'});
            let getOrgs = [];
            getOrgs.push(this.fhService.getOrganizationById(this.org.l1OrgKey, false, true));
            getOrgs.push(this.fhService.getOrganizationById(this.org.l2OrgKey, false, true));
            Observable.forkJoin(getOrgs).subscribe( orgs => {
              this.l1Org = orgs[0]['_embedded'][0].org;
              this.l2Org = orgs[1]['_embedded'][0].org;
              this.dataLoaded = true;
            });
          }
        });
      });

    this.routerEventSubscription = this._router.events.subscribe(
      val => {
        this.isProcurementAAC = val.url.split('/')[2] === 'procurement';
      });

    this.stateOfficeForm = this.builder.group({
      stateOfficeName:['',[]]
    });
    this.contractorForm = this.builder.group({
      contractName: ['', []],
      contractNum: ['', []],
      cageCode: ['', []],
      contractAdmin: ['', []],
      contractExpireDate: ['', [validDateTime, isRequired]],
    });
    this.fpdsReportForm = this.builder.group({
      agencyCode: ['', []],
      cgacCode: ['', []],
    });
    // this.aacRequestService.getAACRequestFormDetail().subscribe(
    //   data => {
    //     this.aacReasonCbxConfig.options = [];
    //     this.addrTypePerReason = {};
    //     data.requestAddressTypes.forEach( e => {
    //       let name = e.requestAddressType.requestTypeName;
    //       this.aacReasonCbxConfig.options.push({value:name, label:name, name:name});
    //       this.addrTypePerReason[name] = [];
    //       e.requestAddressMapping.forEach(addr => {this.addrTypePerReason[name].push(addr.addressTypeName)});
    //       this.reasonValueMap[name] = e.requestAddressType.requestTypeId;
    //     });
    //
    //     this.aacOfficeConfig.options = [];
    //     data.orgTypes.forEach( e => {
    //       this.aacOfficeConfig.options.push({value:e.orgTypeId+"-"+e.orgTypeName,label:e.orgTypeName,name:e.orgTypeName});
    //     });
    //     this.aacOfficeRadioModel = this.aacOfficeConfig.options[0].value;
    // });
    this.aacOfficeConfig.options = [
      {value: '1-Federal Office', label: "Federal Office", name: "Federal Office"},
      {value: '2-State/Local Office', label: "State/Local Office", name: "State/Local Office"},
      {value: '3-Contractor Office', label: "Contractor Office", name: "Contractor Office"},
    ];
    this.aacOfficeRadioModel = this.aacOfficeConfig.options[0].value;
    this.checkSignInUser();
  }

  ngOnDestroy(){
    this.routerEventSubscription.unsubscribe();
  }

  setContractExpireDate(val){this.contractorForm.get('contractExpireDate').setValue(val);}

  generateAACRequestPostObj():any{
    let aacPostObj:any = {};
    aacPostObj.aacExists = this.aacExistRadioModel === 'Yes';
    aacPostObj.orgTypeId = this.aacOfficeRadioModel.split('-')[0];
    aacPostObj.requestorEmailId = this.user.email;
    aacPostObj.username = this.user.fullName;
    aacPostObj.aacLink = "/aac-confirm";
    aacPostObj.orgName = this.org.name;
    // if (this.aacOfficeRadioModel.includes('Contractor')) {
    //   aacPostObj.orgName = this.contractorForm.get("contractName").value;
    //   aacPostObj.contractNumber = this.contractorForm.get("contractNum").value;
    //   aacPostObj.cageCode = this.contractorForm.get("cageCode").value;
    //   aacPostObj.contractAdminName = this.contractorForm.get("contractAdmin").value;
    //   aacPostObj.contractExpiryDate = this.contractorForm.get("contractExpireDate").value;
    // } else if (this.aacOfficeRadioModel.includes('Federal')) {
    //   aacPostObj.orgName = this.aacFederalOrgName.name;
    // } else if (this.aacOfficeRadioModel.includes('State')){
    //   aacPostObj.orgName = this.stateOfficeForm.get("stateOfficeName").value;
    // }

    // aacPostObj.requestIds = [];
    // this.aacReasonCbxModel.forEach( e => {aacPostObj.requestIds.push(this.reasonValueMap[e])});

    // if(this.isReasonContainsFPDSReport()){
    //   aacPostObj.cgacCode = this.fpdsReportForm.get("cgacCode").value;
    //   aacPostObj.subTierAgencyCode = this.fpdsReportForm.get("agencyCode").value;
    // }

    aacPostObj.addressDetails = [];
    this.orgAddresses.forEach( e => {
      aacPostObj.addressDetails.push({
        street1:e.street1,
        street2:e.street2,
        code:e.postalCode,
        state:e.state,
        city:e.city,
        country:e.country,
        addressTypeName:e.addrType
      });
    });
    return aacPostObj;
  }

  onReviewAACRequestClick(){
    // this.formatOfficeInfoError();

    let validateRes = [];
    this.addrForms.forEach( e => {validateRes.push(e.validateForm())});
    Observable.forkJoin(validateRes).subscribe( results => {
      let isAddrValid = true;
      results.forEach(e => {if(e['description'] !== "VALID") isAddrValid = false;});
      if(isAddrValid){
      // if(isAddrValid && this.isOfficeInfoValid()){
        this.aacOfficeInfo = this.generateRequestOfficeInfo();
        this.orgAddresses = [this.mailAddr];

        if(this.hideBillingForm)this.billAddr = Object.assign({},this.mailAddr);
        this.billAddr.addrType = "Billing Address";
        this.orgAddresses.push(this.billAddr);

        if(this.hideShippingForm)this.shipAddr = Object.assign({},this.mailAddr);
        this.shipAddr.addrType = "Shipping Address";
        this.orgAddresses.push(this.shipAddr);

        this.requestIsEdit = false;
        this.requestIsReview = true;
      }
    });


  }

  onEditFormClick(){
    // this.formatOfficeInfoError();
    this.isAddressFormValid();
    this.requestIsEdit = true;
    this.requestIsReview = false;
  }

  onCancelAACRequestClick(){}

  onSubmitFormClick(){
    this.aacRequestService.postAACRequest(this.generateAACRequestPostObj()).subscribe(
      val => {
        this.requestIsReview = false;
        this._router.navigateByUrl('/organization-detail/'+this.orgId);
        // this.requestIsConfirm = true;
        // this.successAlertMsg = true;
        // setTimeout(()=>{this.successAlertMsg = false;}, 3000);
      }
    );
  }

  generateRequestOfficeInfo():any {
    let requestOfficeInfo = [];
    // requestOfficeInfo.push({desc: 'Does an AAC exist for this organization', value: this.aacExistRadioModel});
    // requestOfficeInfo.push({
    //   desc: 'Is the request for a Federal Office, State/Local Office or Contractor',
    //   value: this.aacOfficeRadioModel.substr(this.aacOfficeRadioModel.indexOf('-')+1,this.aacOfficeRadioModel.length - this.aacOfficeRadioModel.indexOf('-'))
    // });
    // if (this.aacOfficeRadioModel.includes('Contractor')) {
    //   requestOfficeInfo.push({desc: 'Contractor Name', value: this.contractorForm.get("contractName").value});
    //   requestOfficeInfo.push({desc: 'Contract Number', value: this.contractorForm.get("contractNum").value});
    //   requestOfficeInfo.push({desc: 'CAGE Code', value: this.contractorForm.get("cageCode").value});
    //   requestOfficeInfo.push({
    //     desc: 'Contract Administrator Name',
    //     value: this.contractorForm.get("contractAdmin").value
    //   });
    //   requestOfficeInfo.push({
    //     desc: 'Contract Expiry Date',
    //     value: this.contractorForm.get("contractExpireDate").value
    //   });
    //
    // } else if (this.aacOfficeRadioModel.includes('Federal')) {
    //   requestOfficeInfo.push({desc: 'Organization Name', value: this.aacFederalOrgName.name});
    // } else if (this.aacOfficeRadioModel.includes('State')){
    //   requestOfficeInfo.push({desc:'Organization Name', value: this.stateOfficeForm.get("stateOfficeName").value});
    // }
    requestOfficeInfo.push({desc: 'Department', value: this.org.l1Name});
    requestOfficeInfo.push({desc: 'Sub Tier', value: this.org.l2Name});
    requestOfficeInfo.push({desc: 'Office', value: this.org.name});
    return requestOfficeInfo;
  }

  getFederalOrgName(org){
    this.aacFederalOrgName = org;
  }


  isAddressFormValid():boolean{
    let isValid = true;
    this.addrForms.forEach( e => {if(!e.validateForm()) isValid = false;});
    return isValid;
  }

  isOfficeInfoValid():boolean{
    let isValid = true;

    if(this.aacOfficeRadioModel.includes('Contract')){
      isValid = this.contractorForm.valid;
    }else if(this.aacOfficeRadioModel.includes('Federal')){
      isValid = !!this.aacFederalOrgName;
    }else if(this.aacOfficeRadioModel.includes('State')){
      isValid = this.stateOfficeForm.valid;
    }
    return isValid;
  }

  // isReasonInfoValid():boolean{
  //   if(this.isReasonContainsFPDSReport()){
  //     return this.fpdsReportForm.valid;
  //   }
  //   return this.aacReasonCbxModel.length !== 0;
  // }

  // isSingleAACRequest():boolean {return this.aacTypeRadioModel === 'single';}
  isSingleAACRequest():boolean {return true;}
  isMultiAACRequest():boolean {return this.aacTypeRadioModel === 'mulitple';}
  isReasonContainsFPDSReport():boolean {return this.aacReasonCbxModel.indexOf("Used for Reporting with FPDS") !== -1;}

  isAddrTypeRequired(addrType):boolean{
    let addrRequired = false;

    this.aacReasonCbxModel.forEach( e => {
      if(this.addrTypePerReason[e].indexOf(addrType) !== -1) addrRequired = true;
    });
    return addrRequired;
  }

  // formatReasonInfoError(){
  //   this.aacReasonCbxConfig.errorMessage = this.aacReasonCbxModel.length === 0?"This field cannot be empty":"";
  //   if(this.isReasonContainsFPDSReport()){
  //     this.fpdsReportForm.get("agencyCode").markAsDirty();
  //     this.fpdsReportForm.get("cgacCode").markAsDirty();
  //     this.agencyCode.wrapper.formatErrors(this.fpdsReportForm.get("agencyCode"));
  //     this.cgacCode.wrapper.formatErrors(this.fpdsReportForm.get("cgacCode"));
  //   }
  // }

  formatOfficeInfoError(){
    if(this.aacOfficeRadioModel.includes('Contract')){
      this.formatContractFormError();
    }else if(this.aacOfficeRadioModel.includes('Federal')){
      this.aacFederalOrgNameErrorMsg = !!this.aacFederalOrgName?'':'This field cannot be empty';
    }else if(this.aacOfficeRadioModel.includes('State')){
      this.stateOfficeForm.get("stateOfficeName").markAsDirty();
      this.stateOfficeName.wrapper.formatErrors(this.stateOfficeForm.get("stateOfficeName"));
    }

  }

  formatContractFormError(){
    this.contractorForm.get("contractName").markAsDirty();
    this.contractorForm.get("contractNum").markAsDirty();
    this.contractorForm.get("cageCode").markAsDirty();
    this.contractorForm.get("contractAdmin").markAsDirty();
    this.contractorForm.get("contractExpireDate").markAsDirty();
    this.contractorName.wrapper.formatErrors(this.contractorForm.get("contractName"));
    this.contractNum.wrapper.formatErrors(this.contractorForm.get("contractNum"));
    this.contractCAGECode.wrapper.formatErrors(this.contractorForm.get("cageCode"));
    this.contractAdmin.wrapper.formatErrors(this.contractorForm.get("contractAdmin"));
    this.contractorExpireDateWrapper.formatErrors(this.contractorForm.get("contractExpireDate"));
  }

  onDuplicateFillChecked(addrType, val){
    if(addrType.includes("Billing")){
      this.hideBillingForm = val.length > 0;
      this.billAddr = this.updateFromMailAddr(this.hideBillingForm, addrType);
    }else if (addrType.includes("Shipping")){
      this.hideShippingForm = val.length > 0;
      this.shipAddr = this.updateFromMailAddr(this.hideShippingForm, addrType);
    }
  }

  updateFromMailAddr(update:boolean, addrType):any{
    let addr = update? Object.assign({},this.mailAddr):Object.assign({},this.emptyAddrObj);
    addr.addrType = addrType;
    return addr;
  }

  onEnterKeyClicked(){if(this.isSingleAACRequest()) this.onReviewAACRequestClick();}

  checkSignInUser() {
    //Get the sign in info
    this.isSignedIn = false;
    this.zone.runOutsideAngular(() => {
      this.iamService.iam.checkSession((user) => {
        this.zone.run(() => {
          this.isSignedIn = true;
          this.user = user;
        });
      });
    });

  }

  getCGACText(org):string{
    let cgacStr = "Not Available";
    if(org.code && org.code !== ""){
      cgacStr = org.code;
    }
    return cgacStr;
  }

}
