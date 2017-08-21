import { ChangeDetectorRef,Component,ViewChild,ViewChildren,ContentChild, Input, Output, EventEmitter,forwardRef,TemplateRef } from "@angular/core";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl,FormControl,ValidatorFn } from "@angular/forms"
import { OptionsType } from 'sam-ui-kit/types';
import { FormBuilder,FormGroup,FormArray } from '@angular/forms';
import { SamModalComponent } from 'sam-ui-kit/components/modal/modal.component';
import * as _ from 'lodash';

@Component ({
    selector: 'sam-listbuilder-card',
    templateUrl: 'sam-listbuilder-card.template.html'
})
export class SamListBuilderCardComponent {
    @Input() data;
    @Input() index;
    @Input() disable:boolean;
    @Input() sortable: boolean = true;
    @Input() firstOfList: boolean;
    @Input() endOfList: boolean;
    @Input() showEditSubform: boolean = false;
    @Input() addMode: boolean = false;
    @Output() action = new EventEmitter();
    private cachedData;
    actionHandler(action){
        let data;
        if(action=="edit"){
            if(this.data.value){
                this.cachedData = this.data.value;
            } else {
                this.cachedData = null;
            }
            this.showEditSubform = true;
            data = this.index;
        }
        if(action=="delete"){
            data = this.index;
        }
        if(action=="editSubmit"){
            this.addMode = false;
            this.showEditSubform=false;
            data = {
                index:this.index,
                data:this.data
            };
        }
        if(action=="moveup"){
            this.showEditSubform=false;
            data = this.index;
        }
        if(action=="movedown"){
            this.showEditSubform=false;
            data = this.index;
        }
        this.action.emit({type:action,data:data});
    }

    cancelEdit(){
        this.showEditSubform = false;
        if(this.addMode){
            this.action.emit({type:'add-cancel',data:this.index});
        } else {
            this.action.emit({type:'edit-cancel',data:{index:this.index,data:this.cachedData}});
        }
    }
}