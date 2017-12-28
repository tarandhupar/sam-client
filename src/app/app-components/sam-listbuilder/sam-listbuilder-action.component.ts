import { ChangeDetectorRef,Component,ViewChild,ViewChildren,ContentChild, Input, Output, EventEmitter,forwardRef,TemplateRef } from "@angular/core";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl,FormControl,ValidatorFn } from "@angular/forms"
import { OptionsType } from 'sam-ui-elements/src/ui-kit/types';
import { FormBuilder,FormGroup,FormArray } from '@angular/forms';
import { SamModalComponent } from 'sam-ui-elements/src/ui-kit/components/modal/modal.component';
import * as _ from 'lodash';

@Component ({
    selector: 'sam-listbuilder-action',
    templateUrl: 'sam-listbuilder-action.template.html'
})
export class SamListBuilderActionComponent {
    @Input() sortable: boolean = true;
    @Input() firstOfList: boolean;
    @Input() endOfList: boolean;
    @Input() disable: boolean;
    @Output() action = new EventEmitter();
    
    dropdownState:boolean = false;
    actionHandler(action){
        this.dropdownState = false;
        this.action.emit(action);
    }
    clickOutside(){
        this.dropdownState = false;
    }
    toggleDropdown(){
        if(!this.disable){
            this.dropdownState=!this.dropdownState;
        }
    }
}