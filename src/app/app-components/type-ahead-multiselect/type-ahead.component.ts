import {Component, Optional, Renderer, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {AutocompleteService} from '../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import {SamAutocompleteComponent} from "../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.component";

@Component({
  selector: 'sam-type-ahead',
  templateUrl: 'type-ahead.template.html'
})
export class SamTypeAheadComponent extends SamAutocompleteComponent {

  @Input()
  placeholder: string;

  @Input()
  selectedList: any;

  @Output()
  modelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Optional() public autocompleteService: AutocompleteService, public renderer: Renderer){
    super(autocompleteService, renderer);
  }

  showDropdown() {
    this.input.nativeElement.focus();
    this.filteredKeyValuePairs = this.filterKeyValuePairs(this.input.nativeElement.value, this.options);
    this.hasFocus = true;
  }

  emitSelected(obj) {
    if(this.checkSelectedList(obj)) {
      this.modelChange.emit(obj);
      this.clearInput();
    }
  }

  checkSelectedList(obj) {
    let filterArr = this.selectedList.filter((newobj)=>{
      if(newobj.value==obj.value){
        return true;
      }
        return false;
    });

    if(filterArr.length==0){
      return true;
    } else {
      return false;
    }
  }

}
