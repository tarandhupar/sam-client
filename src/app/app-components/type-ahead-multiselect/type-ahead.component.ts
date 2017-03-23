import {Component, Optional, Renderer, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {AutocompleteService} from '../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import {SamAutocompleteComponent} from "../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.component";

@Component({
  selector: 'sam-type-ahead',
  templateUrl: 'type-ahead.template.html'
})
export class SamTypeAheadComponent extends SamAutocompleteComponent {

  @ViewChild('listDisplay') listDisplay;

  newValue: string = '';

  @Input()
  Aoptions: any;

  @Input()
  name: string;

  @Input()
  label: string;

  @Input()
  selectedLabel: string;

  @Output()
  modelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Optional() protected autocompleteService: AutocompleteService, protected renderer: Renderer){
    super(autocompleteService, renderer);
  }

  ngOnChanges() {
    if(this.Aoptions) {
      this.options = <string[]>this.Aoptions.map((item)=>{
        return <string>item.label;
      });
    }
  }

  emitResult(value) {
    if(this.listDisplay.selectedItems.indexOf(value) === -1) {
      this.listDisplay.selectedItems.push(value);
    }
    for(var i=0; i<this.Aoptions.length; i++) {
      if(this.Aoptions[i].label == value) {
        this.modelChange.emit(this.Aoptions[i].value);
      }
    }
  }

  showDropdown() {
    this.input.nativeElement.focus();
    this.results = this.filterResults(this.input.nativeElement.value, this.options);
    this.hasFocus = true;
    console.log(this.results);
  }

  checkSelectedList(value) {
    if(this.listDisplay.selectedItems.indexOf(value) === -1) {
      return true;
    } else {
      return false;
    }
  }
}

