import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { LocationService } from 'api-kit/location/location.service';
import { Observable } from 'rxjs';
import {SamAutocompleteComponent} from "sam-ui-kit/form-controls/autocomplete";
import {SamLocationComponent} from "../location-component/location.component";

@Component ({
  selector: 'sam-address-form',
  templateUrl: 'address-form.template.html'
})
export class OrgAddrFormComponent {

  locationObj = {};
  streetAddr1 = "";
  streetAddr2 = "";

  @ViewChild('MailAddrStreetAddr1') addrStreet1:SamTextComponent;
  @ViewChild('locationGroup') locationGroup:SamLocationComponent;


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

  constructor(private builder: FormBuilder, private locationService:LocationService) {}

  ngOnInit() {

    if(this.isAddrModelPopulated()){
      this.populateAddressFormField();
    }else{
      this.locationObj = {
        city: '',
        county: '',
        state: '',
        country: '',
        zip: ''
      };
    }
  }

  isAddrModelPopulated(){
    return this.orgAddrModel.country !== "" && this.orgAddrModel.state !== "" && this.orgAddrModel.city !== "" ;
  }

  populateAddressFormField(){
    // set address form fields here
    this.locationObj = {
      city: {},
      state: {},
      country: {},
      zip: this.orgAddrModel.zip,
    };
    this.streetAddr1 = this.orgAddrModel.street1;
    this.streetAddr2 = this.orgAddrModel.street2;

    this.locationService.searchCountry("iso3", this.orgAddrModel.country).subscribe(data => {
      this.locationObj['country'] = {key:this.orgAddrModel.country,value:this.orgAddrModel.country + " - " + data._embedded.countryList[0].country};
    });
    this.locationService.searchState("statecode", this.orgAddrModel.state, this.orgAddrModel.country).subscribe(data => {
      this.locationObj['state'] = {key:this.orgAddrModel.state,value:this.orgAddrModel.state + " - " + data._embedded.stateList[0].state};

    });
    this.locationService.searchCity(this.orgAddrModel.city, this.orgAddrModel.country, this.orgAddrModel.state, "statecode").subscribe(data => {
      this.locationObj['city'] = {key:data._embedded.cityList[0].cityCode, value:this.orgAddrModel.city + ',' + this.orgAddrModel.state};
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

    if(this.hideAddrForm) return Observable.of({description:"VALID"});
    this.addrStreet1.errorMessage = this.streetAddr1 === ''? 'Street cannot be empty':'';
    if(this.streetAddr1 === '') return Observable.of({description:'INVALID'});

    this.updateAddrModel();
    return this.locationGroup.locationValidation();
  }

  updateAddrModel(){
    if(this.locationObj['country'] && this.locationObj['state'] && this.locationObj['city']){
      this.orgAddrModel['country'] = this.locationObj['country'].key;
      this.orgAddrModel['state'] = this.locationObj['state'].key;
      this.orgAddrModel['city'] = this.locationObj['city'].value?this.locationObj['city'].value.split(',')[0]:'';
      this.orgAddrModel['zip'] = this.locationObj['zip'];
      this.orgAddrModel['street1'] = this.streetAddr1;
      this.orgAddrModel['street2'] = this.streetAddr2;

      this.orgAddrModelChange.emit(this.orgAddrModel);
    }


  }

}
