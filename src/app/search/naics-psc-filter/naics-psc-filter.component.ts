import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {SortArrayOfObjects} from "../../app-pipes/sort-array-object.pipe";

@Component({
  selector: 'sam-naics-psc-filter',
  templateUrl: 'naics-psc-filter.template.html'
})
export class SamNaicsPscFilter {

  @ViewChild('listDisplay') listDisplay;

  @Input()
  selectModel1: any = '';

  @Input()
  selectModel2: string = '';

  @Input()
  options1: any;

  @Input()
  options2: any;

  @Output()
  modelChange1: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  modelChange2: EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  ngOnChanges() {
    if(this.selectModel1 !== '') {
      let selectArray = this.selectModel1.split(",");
      this.populateSelectedList(selectArray, this.options1);
    } else if(this.selectModel2 !== '') {
      let selectArray = this.selectModel2.split(",");
      this.populateSelectedList(selectArray, this.options2);
    } else {
      this.listDisplay.selectedItems = [];
    }
  }

  emitSelected(obj) {
    if(obj.type === 'naics') {
      obj.label += " (NAICS)";
    } else if(obj.type === 'psc') {
      obj.label += " (PSC)";
    }
    this.listDisplay.selectedItems.push(obj);
    this.listDisplay.selectedItems = new SortArrayOfObjects().transform(this.listDisplay.selectedItems, 'label');
    this.emitSelectedList();
  }

  emitSelectedList() {
    let emitArray1 = [];
    let emitArray2 = [];
    for(var i=0; i<this.listDisplay.selectedItems.length; i++) {
      if(this.listDisplay.selectedItems[i].type=="naics") {
        emitArray1.push(this.listDisplay.selectedItems[i].value);
      }
      if(this.listDisplay.selectedItems[i].type=="psc") {
        emitArray2.push(this.listDisplay.selectedItems[i].value);
      }
    }
    this.modelChange1.emit(emitArray1);
    this.modelChange2.emit(emitArray2);
  }

  populateSelectedList(selectArray: any, optionsObj: any) {

    for(var j=0; j<selectArray.length; j++) {
      for(var i=0; i<optionsObj.options.length; i++) {

        if(optionsObj.options[i].value == selectArray[j]) {
          let option = optionsObj.options[i];
          let filterArr = this.listDisplay.selectedItems.filter((obj)=>{
            if(obj.value==option.value){
              return true;
            }
            return false;
          });
          if(filterArr.length==0){
            this.emitSelected(optionsObj.options[i]);
          }
        }
      }
    }
  }

}
