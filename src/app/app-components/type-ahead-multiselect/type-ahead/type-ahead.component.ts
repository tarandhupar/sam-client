import {Component, Optional, Renderer, EventEmitter, Output} from '@angular/core';
import { SamAutocompleteComponent } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete';
import {AutocompleteService} from "../../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service";

@Component({
  selector: 'sam-type-ahead',
  templateUrl: 'type-ahead.template.html'
})
export class SamTypeAheadComponent extends SamAutocompleteComponent {

  @Output()
  addToList:EventEmitter<any> = new EventEmitter<any>();

  constructor(@Optional() private autocompleteService: AutocompleteService, private renderer: Renderer){
    super(autocompleteService, renderer);
  }

  emitResult(value) {
    this.addToList.emit(value);
  }
}

