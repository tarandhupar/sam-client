import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators
} from "@angular/forms";
import * as _ from "lodash";
import { SamFormService } from '../../form-service';
import { LabelWrapper } from '../../wrappers/label-wrapper';

/**
 * The <samPhoneInput> component is a Phone entry portion of a form
 */
@Component( {
  selector: 'sam-poc-entry',
  templateUrl: './poc-entry.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamPOCEntryComponent),
    multi: true
  }]
})
export class SamPOCEntryComponent implements OnInit,ControlValueAccessor {
    @Input() valueFormat: string;
    @Input() pocOptions = [];
    @Input() nameOptions = [];
    @Input() emailOptions = [];
    @Input() manualList:boolean = false;
    @Input() pocSelection;
    @Input() acConfig = {
        keyProperty: 'key',
        valueProperty: 'value'
    };
    @Input() required:boolean;
    @Input() limit = -1;
    @Input() listBuilder;
    @Input() label;
    @Input() showAddress: boolean = true;
    @Output() action = new EventEmitter();

    acSelection;
    disabledFlag: boolean;
    cachedData;

    locationConfig = {
        keyValueConfig: {
            keyProperty: 'key',
            valueProperty: 'value'
        }
    };

    autocompletePeoplePickerConfig = {
        keyValueConfig: {
            keyProperty: 'mail',
            valueProperty: 'givenName',
            subheadProperty: 'mail'
        }
    };

    pocEntryGroup:FormGroup;

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef){ }

    ngOnInit(){
        let controlsConfig = {
          contactId: ["new"],
          title: [""],
          fullName: ["",Validators.required],
          email: ["",[SamPOCEntryComponent.checkEmailPatternVal(this.acConfig),Validators.required]],
          phone: ["",[SamPOCEntryComponent.checkPhonePattern,Validators.required]],
          fax: ["",[SamPOCEntryComponent.checkFaxPattern]],
        };

        if (this.showAddress) {
          Object.assign(controlsConfig, {
            streetAddress: ["",Validators.required],
            streetAddress2: [""],
            city: ["",Validators.required],
            state: ["",Validators.required],
            zip: ["",Validators.required],
            country: ["",Validators.required],
          });
        }

        this.pocEntryGroup = this.fb.group(controlsConfig);
    }

    formCancel(){
        this.pocEntryGroup.reset(this.cachedData);
        if(this.listBuilder){
            let lb = this.listBuilder;
            lb.cards._results[lb.editIndex].cancelEdit();
        }
        this.action.emit({ type: 'cancel', data: this.pocEntryGroup.value });
    }
    formSubmit(){
        for(var i in this.pocEntryGroup.value){
            if (this.pocEntryGroup.value.hasOwnProperty(i)) {
                this.pocEntryGroup.get(i).markAsDirty();
                this.pocEntryGroup.get(i).updateValueAndValidity();
                this.cdr.detectChanges();
            }
        }
        //if(this.pocEntryGroup.valid){
            let entry = {};
            entry = _.cloneDeep(this.pocEntryGroup.value);
            for(let item of ['fullName','email']){
                if(entry[item] && typeof entry[item] == "object"){
                    entry[item] = entry[item][this.acConfig.keyProperty];
                }
            }
            this.onChange(entry);
            this.action.emit({ type: 'submit', data: entry });
            if(this.listBuilder){
                let lb = this.listBuilder;
                lb.cards._results[lb.editIndex].actionHandler('editSubmit');
            }

        //}
    }


    //control value accessor methods
    onChange: any = () => { };
    onTouched: any = () => { };

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    setDisabledState(disabled) {
        this.disabledFlag = disabled;
    }

    writeValue(value) {
        let entry = {};
        if(value){
            let formData = _.cloneDeep(value);
            for(let item of ['fullName','email']){
                if(formData[item]){
                    let obj = {};
                    obj[this.acConfig.keyProperty] = formData[item];
                    obj[this.acConfig.valueProperty] = formData[item];
                    formData[item] = obj;
                }
            }
            this.cachedData = formData;
            this.pocEntryGroup.reset(formData);
            if(formData.contactId != "na"){
                for(var i in this.pocEntryGroup.value){
                    if (this.pocEntryGroup.value.hasOwnProperty(i)) {
                        this.pocEntryGroup.get(i).markAsDirty();
                        this.pocEntryGroup.get(i).updateValueAndValidity({onlySelf:true,emitEvent:true});
                    }
                }
                this.cdr.detectChanges();
            }
        }
    }

    //internal validations
    public static checkEmailPatternVal(acConfig):ValidatorFn {
        return function(control){
            let flag = null;
            let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if(control.value && typeof control.value == "string" && !pattern.test(control.value)){
                flag = {"emailError": {message: "Please enter a valid Internet email address. Format: username@host.domain."}};
            } else if(control.value
                && typeof control.value == "object"
                && acConfig
                && acConfig['valueProperty']
                && control.value[acConfig['valueProperty']]
                && !pattern.test(control.value[acConfig['valueProperty']]))
                flag = {"emailError": {message: "Please enter a valid Internet email address. Format: username@host.domain."}};
            return flag;
        }
    }

    public static checkPhonePattern(control){
        if(control.value && control.value.length !== 10) {
            return {"phoneError": {message: 'Phone must have 10 digits'}};
        }
    }

    public static checkFaxPattern(control){
        if(control.value && control.value.length !== 10) {
            return {"faxError": {message: 'Fax must have 10 digits'}};
        }
    }

    //external validation
    public static pocValidations(control:FormGroup){
        let val = control.value;
        let fieldList = ['fullName', 'email', 'phone', 'streetAddress', 'city', 'state', 'zip'];
        for(let item of fieldList){
            if(!val[item]){
                return {
                    "pocError" :{
                        message: "missing " + item
                    }
                }
            }
        }
    }
}
