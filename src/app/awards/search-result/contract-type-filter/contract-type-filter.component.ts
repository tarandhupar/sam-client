import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';

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
      for(var i=0; i<this.options.options.length; i++) {
        for(var j=0; j<selectArray.length; j++) {
          if(this.options.options[i].value == selectArray[j]) {
            if(this.listDisplay.selectedItems.indexOf(this.options.options[i]) === -1) {
              this.listDisplay.selectedItems.push(this.options.options[i]);
              this.listDisplay.selectedItems.sort();
            }
          }
        }
      }
    } else {
      this.listDisplay.selectedItems = [];
    }
  }

  emitSelected(obj) {
    if(this.listDisplay.selectedItems.indexOf(obj) === -1) {
      this.listDisplay.selectedItems.push(obj);
    }
    this.listDisplay.selectedItems.sort();
    this.emitSelectedList();
  }

  checkSelectedList(obj) {
    if(this.listDisplay.selectedItems.indexOf(obj.label) === -1) {
      return true;
    } else {
      return false;
    }
  }

  emitSelectedList() {
    let emitArray = [];
    for(var i=0; i<this.options.options.length; i++) {
      for(var j=0; j<this.listDisplay.selectedItems.length; j++) {
        if(this.options.options[i] == this.listDisplay.selectedItems[j]) {
          emitArray.push(this.options.options[i].value);
        }
      }
    }
    this.modelChange.emit(emitArray);
  }

}
