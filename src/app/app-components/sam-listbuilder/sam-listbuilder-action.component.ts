import { ChangeDetectorRef,Component,ViewChild,ViewChildren,ContentChild, Input, Output, EventEmitter,forwardRef,TemplateRef } from "@angular/core";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl,FormControl,ValidatorFn } from "@angular/forms"
import { OptionsType } from 'sam-ui-kit/types';
import { FormBuilder,FormGroup,FormArray } from '@angular/forms';
import { SamModalComponent } from 'sam-ui-kit/components/modal/modal.component';
import * as _ from 'lodash';

@Component ({
    selector: 'sam-listbuilder-action',
    template: `
    <span sam-click-outside (clickOutside)="clickOutside($event)">
        <a [ngClass]="{'disabled':disable}" (click)="toggleDropdown()">Actions <i class="fa fa-caret-down"></i></a>
        <ul *ngIf="dropdownState && !disable">
            <li><a (click)="actionHandler('edit')">Edit <i class="fa fa-pencil"></i></a></li>
            <li><a (click)="actionHandler('delete')">Delete <i class="fa fa-times"></i></a></li>
            <li *ngIf="sortable && !firstOfList"><a (click)="actionHandler('moveup')">Move Up <i class="fa fa-arrow-up"></i></a></li>
            <li *ngIf="sortable && !endOfList"><a (click)="actionHandler('movedown')">Move Down <i class="fa fa-arrow-down"></i></a></li>
        </ul>
    </span>`
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