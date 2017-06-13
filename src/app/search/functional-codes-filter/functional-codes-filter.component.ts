import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {SortArrayOfObjects} from "../../app-pipes/sort-array-object.pipe";

@Component({
  selector: 'sam-functional-codes-filter',
  templateUrl: 'functional-codes-filter.template.html'
})
export class SamFunctionalCodesFilter {

  @ViewChild('listDisplay') listDisplay;

  @Input()
  selectModel1: any = '';

  @Input()
  options1: any;

  @Output()
  modelChange1: EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  ngOnChanges() {
    this.listDisplay.selectedItems=[];
    if(this.selectModel1 !== '') {
      let selectArray = this.selectModel1.split(",");
      this.populateSelectedList(selectArray, this.options1);
    }

    if(this.selectModel1 === '') {
      this.listDisplay.selectedItems = [];
    }
  }

  setSelected(obj, shouldEmit:boolean) {
    let o = Object.assign({}, obj);
    // if(obj.type === 'applicant') {
    //   o.label += " (A)";
    // } else if(obj.type === 'beneficiary') {
    //   o.label += " (B)";
    // }
    this.listDisplay.selectedItems.push(o);
    this.listDisplay.selectedItems = new SortArrayOfObjects().transform(this.listDisplay.selectedItems, 'label');
    if(shouldEmit){
      this.emitSelectedList();
    }

  }

  emitSelectedList() {
    let emitArray1 = [];
    for(var i=0; i<this.listDisplay.selectedItems.length; i++) {
        emitArray1.push(this.listDisplay.selectedItems[i].value);
    }
    this.modelChange1.emit(emitArray1);
  }

  populateSelectedList(selectArray: any, optionsObj: any) {

    for(var j=0; j<selectArray.length; j++) {
      for(var i=0; i<optionsObj.options.length; i++) {

        if(optionsObj.options[i].value == selectArray[j]) {
          let option = optionsObj.options[i];
          let filterArr = this.listDisplay.selectedItems.filter((obj)=>{
            if(obj.value==option.value && obj.type == option.type){
              return true;
            }
            return false;
          });
          if(filterArr.length==0){
            this.setSelected(optionsObj.options[i], false);
          }
        }
      }
    }
  }

}
