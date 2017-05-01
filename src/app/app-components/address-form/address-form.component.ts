import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';

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

  stateLocationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    },
    serviceOptions:null
  };

  addressForm:FormGroup;

  @ViewChild('countryWrapper') addrCountry:LabelWrapper;
  @ViewChild('stateWrapper') addrState:LabelWrapper;
  @ViewChild('MailAddrCity') addrCity:SamTextComponent;
  @ViewChild('MailAddrPostalCode') addrPostalCode:SamTextComponent;
  @ViewChild('MailAddrStreetAddr1') addrStreet1:SamTextComponent;

  @Input() showAddIcon:boolean = true;
  @Input() showCloseIcon:boolean = true;
  @Input() hideAddrForm:boolean = false;
  @Input() orgAddrModel:any;
  @Output() onAdditionalAddrRequest:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCancelAdditionalAddrRequest:EventEmitter<any> = new EventEmitter<any>();
  @Output() orgAddrModelChange:EventEmitter<any> = new EventEmitter<any>();

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

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.addressForm = this.builder.group({
      streetAddr1: ['', []],
      streetAddr2: ['', []],
      postalCode: ['', []],
      city: ['', []],
    });
    this.addressForm.get('city').disable();
    this.isStateDisabled = true;
    this.addressForm.get('postalCode').disable();
  }

  onCountryChange(country) {
    this.addressForm.valueChanges.subscribe( data => {
      this.updateAddressFormField();
    });
  }

  onAddrTypeSelect(val){
    this.orgAddrModel.addrType = val;
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
    if(this.addressForm.invalid || this.stateOutput === null || this.stateLocationConfig.serviceOptions === null){
      return false;
    }else{
      this.orgAddrModel.country = this.stateLocationConfig.serviceOptions.key;
      this.orgAddrModel.state = this.stateOutput.value;
      this.updateAddressFormField();
      this.orgAddrModelChange.emit(this.orgAddrModel);
    }
    return true;
  }

  formatError(){
    this.addressForm.get("streetAddr1").markAsDirty();
    this.addressForm.get("postalCode").markAsDirty();
    this.addressForm.get("city").markAsDirty();

    this.addrStreet1.wrapper.formatErrors(this.addressForm.get("streetAddr1"));
    this.addrPostalCode.wrapper.formatErrors(this.addressForm.get("postalCode"));
    this.addrCity.wrapper.formatErrors(this.addressForm.get("city"));

    this.addrState.errorMessage = !!this.stateOutput?"":"This field cannot be empty";
    this.addrCountry.errorMessage = !!this.stateLocationConfig.serviceOptions?"":"This field cannot be empty";
  }

  updateAddressFormField(){
    this.orgAddrModel.city = this.addressForm.get("city").value;
    this.orgAddrModel.postalCode = this.addressForm.get("postalCode").value;
    this.orgAddrModel.street1 = this.addressForm.get("streetAddr1").value;
    this.orgAddrModel.street2 = this.addressForm.get("streetAddr2").value;
  }

  updateCountryField(val){this.orgAddrModel.country = val.key;}
  updateStateField(val){this.orgAddrModel.state = val.value;}

}
