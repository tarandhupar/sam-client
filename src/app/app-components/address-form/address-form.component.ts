import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { LocationService } from 'api-kit/location/location.service';
import { Observable } from 'rxjs';

@Component ({
  selector: 'samAddrForm',
  templateUrl: 'address-form.template.html'
})
export class OrgAddrFormComponent {

  stateOutput:any = null;
  cityOutput:any = null;

  locationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  locationServiceOptions = {
    country: null,
    state: null,
  };

  stateLocationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    },
    serviceOptions:this.locationServiceOptions.country
  };

  cityLocationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    },
    serviceOptions:this.locationServiceOptions
  };


  addressForm:FormGroup;

  @ViewChild('countryWrapper') addrCountry:LabelWrapper;
  @ViewChild('stateWrapper') addrState:LabelWrapper;
  @ViewChild('cityWrapper') addrCity:LabelWrapper;
  //@ViewChild('MailAddrCity') addrCity:SamTextComponent;
  @ViewChild('MailAddrPostalCode') addrPostalCode:SamTextComponent;
  @ViewChild('MailAddrStreetAddr1') addrStreet1:SamTextComponent;

  @Input() showAddIcon:boolean = true;
  @Input() showCloseIcon:boolean = true;
  @Input() hideAddrForm:boolean = false;
  @Input() orgAddrModel:any;
  @Output() onAdditionalAddrRequest:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCancelAdditionalAddrRequest:EventEmitter<any> = new EventEmitter<any>();
  @Output() orgAddrModelChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() onEnableAddIcon:EventEmitter<boolean> = new EventEmitter<boolean>();

  orgAddrSelectConfig = {
    options:[
      {value: '', label: 'Select Address Type', name: 'default', disabled:true},
      {value: 'Billing Address', label: 'Billing Address', name: 'Billing'},
      {value: 'Shipping Address', label: 'Shipping Address', name: 'Shipping'},
    ],
    label: '',
    name: 'Org Address Types',
  };

  basicType = "Mailing Address";
  isStateDisabled: boolean = true;
  isCityDisabled: boolean = true;

  constructor(private builder: FormBuilder, private locationService:LocationService) {}

  ngOnInit() {
    this.addressForm = this.builder.group({
      streetAddr1: ['', []],
      streetAddr2: ['', []],
      postalCode: ['', []],
      city: ['', []],
    });
    //this.addressForm.get('city').disable();
    this.isCityDisabled = true;
    this.isStateDisabled = true;
    this.addressForm.get('postalCode').disable();
  }

  onAddrTypeSelect(val){
    this.orgAddrModel.addrType = val;
    this.onEnableAddIcon.emit(true);
  }

  onAdditionalAddressFormClick(val){
    this.onAdditionalAddrRequest.emit(true);
  }

  onCancelAddressFormClick(){
    this.onCancelAdditionalAddrRequest.emit(this.orgAddrModel);
  }

  isOrgTypeSelected(){
    return this.orgAddrModel.addrType !== "";
  }

  isBasicAddressType(){
    return this.orgAddrModel.addrType === this.basicType;
  }

  validateForm():boolean{
    if(this.hideAddrForm) return true;
    this.formatError();
    if(this.addressForm.invalid || this.locationServiceOptions.state === null || this.locationServiceOptions.country === null){
      return false;
    }else{

      this.updateAddressFormField();
      this.orgAddrModelChange.emit(this.orgAddrModel);
    }
    this.validateZip();
    return this.isZipValid;
  }

  isZipValid = true;
  async validateZip(){
    await this.locationService.validateZip(this.addressForm.get("postalCode").value).subscribe(
      data => {
        if(data.description !== "VALID") {this.isZipValid = false;}
      }
    );
  }


  formatError(){
    this.addressForm.get("streetAddr1").markAsDirty();
    this.addressForm.get("postalCode").markAsDirty();
    this.addressForm.get("city").markAsDirty();

    this.addrStreet1.wrapper.formatErrors(this.addressForm.get("streetAddr1"));
    this.addrPostalCode.wrapper.formatErrors(this.addressForm.get("postalCode"));
    if(this.addressForm.get("postalCode").value !== ""){
      this.locationService.validateZip(this.addressForm.get("postalCode").value).subscribe(data => {
        if(data.description !== "VALID"){this.addrPostalCode.wrapper.errorMessage = "Invalid Postal Code";}
      });
    }
    this.addrCity.formatErrors(this.addressForm.get("city"));

    this.addrState.errorMessage = !!this.locationServiceOptions.state?"":"This field cannot be empty";
    this.addrCountry.errorMessage = !!this.locationServiceOptions.country?"":"This field cannot be empty";
  }

  updateAddressFormField(){
    this.orgAddrModel.country = this.locationServiceOptions.country.key;
    // state and city should be updated already
    this.orgAddrModel.postalCode = this.addressForm.get("postalCode").value;
    this.orgAddrModel.street1 = this.addressForm.get("streetAddr1").value;
    this.orgAddrModel.street2 = this.addressForm.get("streetAddr2").value;
  }

  updateCountryField(val){
    this.isCityDisabled = false;
    this.isStateDisabled = false;
    this.addressForm.get('postalCode').enable();

    this.orgAddrModel.country = val.key;
  }

  stateCode;
  updateStateField(val){
    let v;
    if (val.value) {
      v = val.value;
    } else if (typeof val === 'string') {
      v = val;
    } else {
      throw new TypeError('statefield: unrecognied type for val');
    }
    this.orgAddrModel.state = v;
    this.stateCode = v;
  }

  stateId() {
    return this.stateCode;
  }

  updateCityField(val) {
    if (val.value) {
      this.orgAddrModel.city = val.value;
    } else if (typeof val === 'string') {
      this.orgAddrModel.city = val;
    } else {
      throw new TypeError('unrecognized type for val');
    }

  }

  countryCode() {
    return this.orgAddrModel.country;
  }

  onZipCodeBlur(){
    let zip = this.addressForm.get("postalCode").value;
    if(zip.length !== 9) return;
    if(this.locationServiceOptions.state === null && this.cityOutput === null){
      this.locationService.getLocationByPostolCode(zip).subscribe(
        data => {
          let location = data._embedded.locationList[0];
          this.locationServiceOptions.state = {key:location.state.stateCode,value:location.state.state};
          this.cityOutput = {key:location.city.cityCode,value:location.city.city};
        },
        error => {}
      );
    }
  }
}
