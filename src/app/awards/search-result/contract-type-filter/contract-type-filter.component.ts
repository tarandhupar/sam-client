import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {SortArrayOfObjects} from "../../../app-pipes/sort-array-object.pipe";

@Component({
  selector: 'sam-contract-type-filter',
  templateUrl: 'contract-type-filter.template.html'
})
export class SamContractTypeFilter {

  @ViewChild('listDisplay') listDisplay;

  @Input()
  selectModel: string;

  @Input()
  options: any;

  @Output()
  modelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  ngOnChanges() {
    if(this.selectModel !== '') {
      let selectArray = this.selectModel.split(",");

      for(var j=0; j<selectArray.length; j++) {
        for(var i=0; i<this.options.options.length; i++) {
          if(this.options.options[i].value == selectArray[j]) {

            let option = this.options.options[i];
            let filterArr = this.listDisplay.selectedItems.filter((obj)=>{
              if(obj.value==option.value){
                return true;
              }
                return false;
            });

            if(filterArr.length==0){
              this.emitSelected(this.options.options[i]);
            }

          }
        }
      }
    } else {
      this.listDisplay.selectedItems = [];
    }
  }

  emitSelected(obj) {
    this.listDisplay.selectedItems.push(obj);
    this.listDisplay.selectedItems = new SortArrayOfObjects().transform(this.listDisplay.selectedItems, 'label');
    this.emitSelectedList();
  }

  emitSelectedList() {
    let emitArray = [];
    for(var i=0; i<this.listDisplay.selectedItems.length; i++) {
      emitArray.push(this.listDisplay.selectedItems[i].value);
    }
    this.modelChange.emit(emitArray);
  }

}
