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
    this.listDisplay.selectedItems.sort(function (a, b){
      var nameA = a.label.toUpperCase(); // ignore upper and lowercase
      var nameB = b.label.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
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
