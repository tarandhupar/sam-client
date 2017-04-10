import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
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
  countryOutput:any;
  stateOutput:any;
  cityOutput:any;

  addressForm:FormGroup;

  @Input() orgAddrModel:any = {};
  @Input() orgAddrType = '';
  @Input() orgAddrTypeSelected = false;
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

  constructor(private builder: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(){
    this.addressForm = this.builder.group({
      streetAddr1: ['', []],
      streetAddr2: ['', []],
      postalCode: ['', []],
      city: ['', []],
    });
  }

  onAddrTypeSelect(val){
    this.orgAddrTypeSelected = true;
    this.orgAddrType = val;
  }

  onAdditionalAddressFormClick(val){
    this.onAdditionalAddrRequest.emit(true);
  }

  onCancelAddressFormClick(){
    console.log(this.orgAddrType);
    this.onCancelAdditionalAddrRequest.emit(this.orgAddrType);
  }
}
