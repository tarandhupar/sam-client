import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { FormBuilder,FormArray,FormGroup,FormControl,AbstractControl} from '@angular/forms';
import * as _ from "lodash";
/**
* SectionComponent - section component with an h3 title
*/
@Component({
	selector: 'sam-table-entry',
	templateUrl:'sam-table-entry.template.html'
})
export class SamTableEntryComponent {
    @ContentChild('display', {read: TemplateRef}) displayTemplate: TemplateRef<any>;
    @ContentChild('subDisplay', {read: TemplateRef}) subDisplayTemplate: TemplateRef<any>;
    @ContentChild('edit', {read: TemplateRef}) editTemplate: TemplateRef<any>;
    @ContentChild('subEdit', {read: TemplateRef}) subEditTemplate: TemplateRef<any>;
    @Input() formArray: FormArray;
    @Input() columnHeaders = [];
    @Input() columnSizes = [];
    @Input() addText = "Add Entry";
    @Input() controlTemplate: AbstractControl;
    @Input() subControlTemplate: AbstractControl;
    @Input() subRows: boolean;
    mode="";
    editIndex=-1;
    editSubIndex=-1;
    disableActions = false;
    actionsTemplate: Array<any> = [
        { name: 'edit', label: 'Edit', icon: 'fa fa-pencil', callback: null},
        { name: 'remove', label: 'Remove', icon: 'fa fa-close', callback: null },        
    ];
    moveUpActionTemplate = { name: 'moveup', label: 'Move Up', icon: null, callback: null };
    moveDownActionTemplate = { name: 'movedown', label: 'Move Down', icon: null, callback: null };
    subEntryActionTemplate = { name: 'add sub-entry', label: 'Add Sub-Entry', icon: "fa fa-plus", callback: null };
    actions = [];
    subActions = [];
    formArrayMirror:FormArray;

    ngOnInit(){
        this._syncWithMirror();
        this._setupActions();
    }
    cachedValue;
    subCachedValue;
    _syncWithMirror(){
        this.formArrayMirror = _.cloneDeep(this.formArray);
    }
    _setupActions(){
        if(this.formArray){
            this.actions = [];
            this.subActions = [];
            for(let i = 0; i< this.formArray.controls.length; i++){
                let action = _.cloneDeep(this.actionsTemplate);
                action[0]['callback'] = ()=>{return this.editCallback(i)};
                action[1]['callback'] = ()=>{return this.removeCallback(i)};
                if(i!=0){
                    action.push(_.cloneDeep(this.moveUpActionTemplate));
                    action[action.length-1]['callback'] = ()=>{return this.moveupCallback(i)};
                }
                if(i!=this.formArray.controls.length-1){
                    action.push(_.cloneDeep(this.moveDownActionTemplate));
                    action[action.length-1]['callback'] = ()=>{return this.movedownCallback(i)};
                }
                if(this.subRows){
                    action.unshift(_.cloneDeep(this.subEntryActionTemplate));
                    action[0]['callback'] = ()=>{return this.addSubEntryCallback(i)};
                    this._setupSubActions(i);
                }
                this.actions.push(action);
            }
        }
    }
    _setupSubActions(idx){
        let length = 0;
        let arr = [];
        if((<FormArray>this.formArray.controls[idx].get('subRow')).controls.length){
            length = (<FormArray>this.formArray.controls[idx].get('subRow')).controls.length;
        }
        for(let j = 0; j < length; j++){
            let subAction = _.cloneDeep(this.actionsTemplate);
            subAction[0]['callback'] = ()=>{return this.subEditCallback(idx,j)};
            subAction[1]['callback'] = ()=>{return this.subRemoveCallback(idx,j)};
            if(j!=0){
                subAction.push(_.cloneDeep(this.moveUpActionTemplate));
                subAction[subAction.length-1]['callback'] = ()=>{return this.moveupSubRowCallback(idx,j)};
            }
            if(j!=length-1){
                subAction.push(_.cloneDeep(this.moveDownActionTemplate));
                subAction[subAction.length-1]['callback'] = ()=>{return this.movedownSubRowCallback(idx,j)};
            }
            arr.push(subAction);
        }
        this.subActions[idx] = arr;
    }

    subEditCallback(lvlOneIdx,lvlTwoIdx){
        this.editIndex = parseInt(lvlOneIdx);
        this.editSubIndex = parseInt(lvlTwoIdx);
        this.cachedValue = this.formArray.controls[lvlOneIdx].value;
        this.subCachedValue = (<FormArray>(<FormGroup>(<FormArray>this.formArray).at(lvlOneIdx)).get('subRow')).at(lvlTwoIdx).value;
        this.mode = "subEdit";
        this.disableActions = true;
    }
    subRemoveCallback(lvlOneIdx,lvlTwoIdx){
        (<FormArray>(<FormGroup>(<FormArray>this.formArray).at(lvlOneIdx)).get('subRow')).removeAt(lvlTwoIdx);
        this._syncWithMirror();
        this._setupActions();
    }
    cancelSubAdd(lvlOneIdx,lvlTwoIdx){
        this.disableActions = false;
        this.mode="";
        (<FormArray>this.formArray.at(lvlOneIdx).get('subRow')).removeAt(lvlTwoIdx);
        this._syncWithMirror();
        this._setupActions();
    }
    cancelSubEdit(lvlOneIdx,lvlTwoIdx){
        this.disableActions = false;
        (<FormArray>this.formArray.at(lvlOneIdx).get('subRow')).at(lvlTwoIdx).reset(this.subCachedValue);
        this.mode="";
        this._syncWithMirror();
        this._setupActions();
    }
    submitSubEdit(lvlOneIdx,lvlTwoIdx){
        this.disableActions = false;
        this.mode="";
        this._syncWithMirror();
        this._setupActions();
    }
    editCallback(idx){
        this.editIndex = parseInt(idx);
        this.mode = "edit";
        this.cachedValue = this.formArray.controls[idx].value;
        this.disableActions = true;
    }
    removeCallback(idx){
        this.formArray.removeAt(idx);
        this._syncWithMirror();
        this._setupActions();
    }
    moveupCallback(idx){
        this._move(this.formArray.controls,idx,idx-1);
        this._syncWithMirror();
        this._setupActions();
    }
    movedownCallback(idx){
        this._move(this.formArray.controls,idx,idx+1);
        this._syncWithMirror();
        this._setupActions();
    }
    moveupSubRowCallback(lvlOneIdx,lvlTwoIdx){
        let arr = (<FormArray>this.formArray.at(lvlOneIdx).get('subRow')).controls;
        this._move(arr,lvlTwoIdx,lvlTwoIdx-1);
        this._syncWithMirror();
        this._setupActions();
    }
    movedownSubRowCallback(lvlOneIdx,lvlTwoIdx){
        let arr = (<FormArray>this.formArray.at(lvlOneIdx).get('subRow')).controls;
        this._move(arr,lvlTwoIdx,lvlTwoIdx+1);
        this._syncWithMirror();
        this._setupActions();
    }
    addSubEntryCallback(i){
        let control = _.cloneDeep(this.subControlTemplate);
        (<FormArray>this.formArray.at(i).get('subRow')).push(control);
        this.editIndex = i;
        this.editSubIndex = (<FormArray>this.formArray.at(i).get('subRow')).controls.length-1;
        this.mode= "subAdd";
        this.disableActions = true;
        this._syncWithMirror();
        this._setupActions();
    }

    _move(array, from, to) {
        if( to === from ) return array;

        var target = array[from];                         
        var increment = to < from ? -1 : 1;

        for(var k = from; k != to; k += increment){
            array[k] = array[k + increment];
        }
        array[to] = target;
        return array;
    }
    addItem(){
        let control = _.cloneDeep(this.controlTemplate);
        this.formArray.push(control);
        this.editIndex = this.formArray.controls.length-1;
        this.mode= "add";
        this.disableActions = true;
        this._syncWithMirror();
        this._setupActions();
    }

    cancelEdit(idx){
        this.disableActions = false;
        this.formArray.controls[idx].reset(this.cachedValue);
        this.mode="";
        this._syncWithMirror();
        this._setupActions();
    }
    cancelAdd(idx){
        this.disableActions = false;
        this.mode="";
        this.formArray.removeAt(this.editIndex);
        this._syncWithMirror();
        this._setupActions();
    }

    submitEdit(idx){
        this.disableActions = false;
        this.mode="";
        this._syncWithMirror();
        this._setupActions();
    }
}
