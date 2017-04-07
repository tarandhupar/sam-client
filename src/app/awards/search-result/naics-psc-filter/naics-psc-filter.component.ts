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
  filteredResult: any = [];

  @Input()
  options1: any;

  @Output()
  modelChange1: EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  ngOnChanges() {

    if(this.selectModel1 !== '') {
      let selectArray = this.selectModel1.split(",");

      for(var j=0; j<selectArray.length; j++) {
      for(var i=0; i<this.options1.options.length; i++) {
          if(this.options1.options[i].value == selectArray[j]) {

            let option = this.options1.options[i];
            let filterArr = this.listDisplay.selectedItems.filter((obj)=>{
              if(obj.value==option.value){
                return true;
              }
              return false;
            });

            if(filterArr.length==0){
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
