import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { LocationService } from 'api-kit/location/location.service';
import { Observable } from 'rxjs';
import {SamAutocompleteComponent} from "sam-ui-kit/form-controls/autocomplete";

@Component ({
  selector: 'sam-address-form',
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

  state; // this is bound to the component model, but is unused. Component throws an exception without it
  country; // bound but unused

  cityLocationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    },
    serviceOptions:{
      country: null,
      state: null,
    }
  };


  addressForm:FormGroup;

  @ViewChild('countryWrapper') addrCountry:LabelWrapper;
  @ViewChild('stateWrapper') addrState:LabelWrapper;
  @ViewChild('cityWrapper') addrCity:LabelWrapper;
  @ViewChild('MailAddrCity') citySelect:SamAutocompleteComponent;
  @ViewChild('MailAddrState') stateSelect:SamAutocompleteComponent;
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

    if(this.isAddrModelPopulated()){
      this.populateAddressFormField();
      this.isCityDisabled = false;
      this.isStateDisabled = false;
      this.addressForm.get('postalCode').enable();
    }
  }

  isAddrModelPopulated(){
    return this.orgAddrModel.country !== "" && this.orgAddrModel.state !== "" && this.orgAddrModel.city !== "" ;
  }

  populateAddressFormField(){
    this.addressForm.get("postalCode").setValue(this.orgAddrModel.postalCode );
    this.addressForm.get("streetAddr1").setValue(this.orgAddrModel.street1 );
    this.addressForm.get("streetAddr2").setValue(this.orgAddrModel.street2 );

    this.locationService.searchCountry("iso3", this.orgAddrModel.country).subscribe(data => {
      this.country = {key:this.orgAddrModel.country,value:data._embedded.countryList[0].country};
      this.cityLocationConfig.serviceOptions.country = this.orgAddrModel.country;
    });
    this.locationService.searchState("statecode", this.orgAddrModel.state, this.orgAddrModel.country).subscribe(data => {
      this.state = {key:this.orgAddrModel.state,value: data._embedded.stateList[0].state};
      this.cityLocationConfig.serviceOptions.state = this.orgAddrModel.state;
    });
    this.locationService.searchCity(this.orgAddrModel.city, this.orgAddrModel.country, this.orgAddrModel.state, "statecode").subscribe(data => {
      this.cityOutput = {key:data._embedded.cityList[0].cityCode, value:this.orgAddrModel.city};
    });
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

  validateForm():Observable<any>{
    let zipCode = this.addressForm.get("postalCode").value;
    if(this.hideAddrForm) return Observable.of({description:"VALID"});
    this.formatError();
    if(this.addressForm.invalid || this.cityLocationConfig.serviceOptions.state === null || this.cityLocationConfig.serviceOptions.country === null || this.cityOutput === null ||
      (zipCode.length !== 5 && zipCode.length !== 9)){
      Observable.of({description:"INVALID"});
    }else{

      this.updateAddressFormField();
      this.orgAddrModelChange.emit(this.orgAddrModel);
    }
    return this.locationService.validateZipWIthLocation(zipCode, this.cityLocationConfig.serviceOptions.state, this.cityOutput);
  }

  formatError(){
    this.addressForm.get("streetAddr1").markAsDirty();
    this.addressForm.get("postalCode").markAsDirty();
    this.addressForm.get("city").markAsDirty();

    this.addrStreet1.wrapper.formatErrors(this.addressForm.get("streetAddr1"));
    this.formateZipError();
    this.addrCity.errorMessage = !!this.cityOutput?"":"This field cannot be empty";
    this.addrState.errorMessage = !!this.cityLocationConfig.serviceOptions.state?"":"This field cannot be empty";
    this.addrCountry.errorMessage = !!this.cityLocationConfig.serviceOptions.country?"":"This field cannot be empty";
  }

  formateZipError(){
    this.addrPostalCode.wrapper.formatErrors(this.addressForm.get("postalCode"));
    let zipCode = this.addressForm.get("postalCode").value;

    if(zipCode != ''){
      this.addrPostalCode.wrapper.errorMessage = "";
      if(zipCode.length !== 5 && zipCode.length !== 9){
        this.addrPostalCode.wrapper.errorMessage = "Invalid Postal Code";
      }else{
        this.locationService.validateZipWIthLocation(zipCode, this.cityLocationConfig.serviceOptions.state, this.cityOutput).subscribe(data => {
          if(data.description !== "VALID"){this.addrPostalCode.wrapper.errorMessage = "Invalid Postal Code";}
        }, error => {this.addrPostalCode.wrapper.errorMessage = "Invalid Postal Code";});

      }
    }else {this.addrPostalCode.wrapper.errorMessage = "This field cannot be empty";}
  }

  updateAddressFormField(){
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
    this.cityLocationConfig.serviceOptions.country = val.key;
  }

  updateStateField(val){
    if (!val || !val.key || !val.value) {
      return;
    }
    this.orgAddrModel.state = val.key;
    this.cityLocationConfig.serviceOptions.state = val.key;
  }

  updateCityField(val) {
    if (!val || !val.value) {
      return;
    }
    this.orgAddrModel.city = val.value.substr(0, val.value.length - 4);
  }

  countryCode() {
    return this.orgAddrModel.country;
  }

  onZipCodeBlur(e){
    let zip = this.addressForm.get("postalCode").value;
    if(zip.length !== 9) return;
    if(this.cityLocationConfig.serviceOptions.state === null && this.cityOutput === null){
      this.locationService.getLocationByPostolCode(zip).subscribe(
        data => {
          let location = data._embedded.locationList[0];
          this.cityLocationConfig.serviceOptions.state = {key:location.state.stateCode,value:location.state.state};
          this.cityOutput = {key:location.city.cityCode,value:location.city.city};
        },
        error => {}
      );
    }
  }
}
