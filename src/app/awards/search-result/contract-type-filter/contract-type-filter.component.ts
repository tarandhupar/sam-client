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
    this.listDisplay.selectedItems.push(obj);
    this.listDisplay.selectedItems.sort();
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
