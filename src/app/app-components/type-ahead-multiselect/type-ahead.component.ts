import {Component, Optional, Renderer, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {AutocompleteService} from '../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import {SamAutocompleteComponent} from "../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.component";

@Component({
  selector: 'sam-type-ahead',
  templateUrl: 'type-ahead.template.html'
})
export class SamTypeAheadComponent extends SamAutocompleteComponent {

  @ViewChild('listDisplay') listDisplay;

  @Input()
  selectModel: string;

  @Input()
  placeholder: string;

  @Input()
  selectedLabel: string;

  @Output()
  modelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Optional() public autocompleteService: AutocompleteService, public renderer: Renderer){
    super(autocompleteService, renderer);
  }

  ngOnChanges() {
    if(this.selectModel !== '') {
      let selectArray = this.selectModel.split(",");
      for(var i=0; i<this.options.length; i++) {
        for(var j=0; j<selectArray.length; j++) {
          if(this.options[i].value == selectArray[j]) {
            if(this.listDisplay.selectedItems.indexOf(this.options[i].label) === -1) {
              this.listDisplay.selectedItems.push(this.options[i].label);
            }
          }
        }
      }
    } else {
      this.listDisplay.selectedItems = [];
    }
  }

  showDropdown() {
    this.input.nativeElement.focus();
    this.filteredKeyValuePairs = this.filterKeyValuePairs(this.input.nativeElement.value, this.options);
    this.hasFocus = true;
  }

  setSelectedList(obj) {
    if(this.listDisplay.selectedItems.indexOf(obj.label) === -1) {
      this.listDisplay.selectedItems.push(obj.label);
    }
    this.emitSelected();
    this.clearInput();
  }

  checkSelectedList(obj) {
    if(this.listDisplay.selectedItems.indexOf(obj.label) === -1) {
      return true;
    } else {
      return false;
    }
  }

  emitSelected() {
    let emitArray = [];
    for(var i=0; i<this.options.length; i++) {
      for(var j=0; j<this.listDisplay.selectedItems.length; j++) {
        if(this.options[i].label == this.listDisplay.selectedItems[j]) {
          emitArray.push(this.options[i].value);
        }
      }
    }
    this.modelChange.emit(emitArray);
  }

}

