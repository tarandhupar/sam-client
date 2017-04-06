import {Component, EventEmitter, Output, ViewChild, Input} from '@angular/core';

@Component({
  selector: 'sam-naics-psc-filter',
  templateUrl: 'naics-psc-filter.template.html'
})
export class SamNaicsPscFilter {

  @ViewChild('listDisplay') listDisplay;

  @Input()
  selectModel1: any = [];

  @Input()
  options1: any;

  @Output()
  modelChange1: EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  ngOnChanges() {
    if(this.selectModel1 !== '') {
      let selectArray = this.selectModel1.split(",");
      for(var i=0; i<this.options1.options.length; i++) {
        for(var j=0; j<selectArray.length; j++) {
          if(this.options1.options[i].value == selectArray[j]) {
            if(this.listDisplay.selectedItems.indexOf(this.options1.options[i]) === -1) {
              this.listDisplay.selectedItems.push(this.options1.options[i]);
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
    this.modelChange1.emit(emitArray);
  }

}
