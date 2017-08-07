import { ChangeDetectorRef,Component,ViewChild,ViewChildren,ContentChild, Input, Output, EventEmitter,forwardRef,TemplateRef } from "@angular/core";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl,FormControl,ValidatorFn } from "@angular/forms"
import { OptionsType } from 'sam-ui-kit/types';
import { FormBuilder,FormGroup,FormArray } from '@angular/forms';
import { SamModalComponent } from 'sam-ui-kit/components/modal/modal.component';
import * as _ from 'lodash';

@Component ({
    selector: 'sam-listbuilder',
    templateUrl: 'sam-listbuilder.template.html'
})
export class SamListBuilderComponent {
    @Input() formArrayInput = [];
    @Input() formGroupTemplate:FormGroup;
    @Input() label:string;
    @Input() hint:string;
    @Input() required:boolean;
    @Input() max:number = null;
    @Input() sortable:boolean = true;
    @Input() sortingFn;
    @Input() control:AbstractControl;
    @Output() formArrayChange:EventEmitter<any> = new EventEmitter();
    @Output() action:EventEmitter<any> = new EventEmitter();
    
    @ContentChild('edit', {read: TemplateRef}) editTemplate: TemplateRef<any>;
    @ContentChild('display', {read: TemplateRef}) displayTemplate: TemplateRef<any>;
    @ViewChild('wrapper') wrapper;
    @ViewChildren('cards') cards;

    editIndex:number;
    model = [];
    returnModel = [];
    showAddSubform: boolean = false;
    showEditSubform: boolean = false;

    constructor(private cdr: ChangeDetectorRef){}
    ngOnInit(){
        this.setupModel();
        if(this.control){
            this.control.statusChanges.subscribe(() => {
                this.wrapper.formatErrors(this.control);
            });
            this.wrapper.formatErrors(this.control);
        }
    }
    ngOnChanges(c){
        if(c['formArrayInput']){
            this.setupModel();
        }
    }
    setupModel(){
        this.model = _.cloneDeep(this.formArrayInput);
        for(let i in this.model){
            this.model[i].setParent(null);
            this.model[i].markAsDirty();
            this.model[i].updateValueAndValidity({onlySelf:true,emitEvent:true});
            this.recursivelyMarkAndValidate(this.model[i]);
        }
    }
    recursivelyMarkAndValidate(control){
        if(!control.controls){
            return;
        }
        let keys = Object.keys(control.controls);
        if(keys.length==0){
            return;
        }
        for(let key of keys){
            let subControl = control.get(key);
            subControl.markAsDirty();
            subControl.updateValueAndValidity({onlySelf:true,emitEvent:true});
            this.recursivelyMarkAndValidate(subControl);
        }
    }
    showAdd(){
        this.model.push(_.cloneDeep(this.formGroupTemplate));
        this.editIndex = this.model.length-1;
        this.cdr.detectChanges();
        this.cards.last.showEditSubform = true;
        this.showEditSubform = true;
        this.cards.last.addMode = true;

        this.action.emit("add");
    }
    editRow(index,control){
        this.showEditSubform = false;
        this.model[index]= control;
        if(!this.sortable && this.sortingFn){
            this.model = this.model.sort(this.sortingFn);
        }
        this.formArrayChange.emit(this.model);
    }
    move(array, from, to) {
        if( to === from ) return array;

        var target = array[from];                         
        var increment = to < from ? -1 : 1;

        for(var k = from; k != to; k += increment){
            array[k] = array[k + increment];
        }
        array[to] = target;
        return array;
    }
    cardHandler(event){
        if(event.type=="edit"){
            this.showEditSubform = true;
            this.editIndex = event.data;
            this.recursivelyMarkAndValidate(this.model[this.editIndex]);
        }
        if(event.type=="editSubmit"){
            let index = event.data.index;
            let data = event.data.data;
            this.editRow(index,data);
        }
        if(event.type=="delete"){
            let index = event.data;
            this.model.splice(index,1);
            this.formArrayChange.emit(this.model);
        } 
        if(event.type=="moveup"){
            let index = event.data;
            let item = this.model[index];
            this.editIndex = null;
            this.model = this.move(this.model,index,index-1);
            this.formArrayChange.emit(this.model);
        } 
        if(event.type=="movedown"){
            let index = event.data;
            let item = this.model[index];
            this.editIndex = null;
            this.model = this.move(this.model,index,index+1);
            this.formArrayChange.emit(this.model);
        }
        if(event.type=="add-cancel"){
            this.showEditSubform = false;
            let index = event.data;
            this.model.splice(index,1);
        }
        if(event.type=="edit-cancel"){
            this.showEditSubform = false;
            this.model[event.data.index].reset(event.data.data);
            if(!this.sortable && this.sortingFn){
                this.model = this.model.sort(this.sortingFn);
            }
            this.formArrayChange.emit(this.model);
        }
        this.action.emit(event.type);
    }
}