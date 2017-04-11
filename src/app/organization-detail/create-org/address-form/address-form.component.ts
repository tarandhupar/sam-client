import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
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

@Component ({
  selector: 'samAddrForm',
  templateUrl: 'address-form.template.html'
})
export class OrgAddrFormComponent {
  locationConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };
  countryOutput:any = {};
  stateOutput:any = {};
  cityOutput:any = {};

  addressForm:FormGroup;

  @ViewChild('countryWrapper') addrCountry:LabelWrapper;
  @ViewChild('stateWrapper') addrState:LabelWrapper;
  @ViewChild('MailAddrCity') addrCity:SamTextComponent;
  @ViewChild('MailAddrPostalCode') addrPostalCode:SamTextComponent;
  @ViewChild('MailAddrStreetAddr1') addrStreet1:SamTextComponent;

  @Input() showAddIcon:boolean = true;
  @Input() orgAddrModel:any = {};
  @Output() onAdditionalAddrRequest:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCancelAdditionalAddrRequest:EventEmitter<any> = new EventEmitter<any>();

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

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.addressForm = this.builder.group({
      streetAddr1: ['', []],
      streetAddr2: ['', []],
      postalCode: ['', []],
      city: ['', []],
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
    if(this.addressForm.invalid || this.stateOutput == {} || this.countryOutput == {}){
      this.addressForm.get("streetAddr1").markAsDirty();
      this.addressForm.get("postalCode").markAsDirty();
      this.addressForm.get("city").markAsDirty();

      this.addrStreet1.wrapper.formatErrors(this.addressForm.get("streetAddr1"));
      this.addrPostalCode.wrapper.formatErrors(this.addressForm.get("postalCode"));
      this.addrCity.wrapper.formatErrors(this.addressForm.get("city"));

      this.addrState.errorMessage = !!this.stateOutput.value?"":"This field cannot be empty";
      this.addrCountry.errorMessage = !!this.countryOutput.value?"":"This field cannot be empty";


      return false;
    }else{
      this.orgAddrModel.country = this.countryOutput.value;
      this.orgAddrModel.state = this.stateOutput.value;
      this.orgAddrModel.street = this.addressForm.get("streetAddr1").value+" "+this.addressForm.get("streetAddr2").value;
      this.orgAddrModel.city = this.addressForm.get("city").value;
      this.orgAddrModel.postalCode = this.addressForm.get("postalCode").value;


    }
    return true;
  }
}
