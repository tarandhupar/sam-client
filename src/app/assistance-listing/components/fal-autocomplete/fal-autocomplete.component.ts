import {Component, Optional, Renderer, EventEmitter, Output, ViewChild, Input} from '@angular/core';
import {AutocompleteService} from '../../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import {SamAutocompleteComponent} from "../../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.component";

@Component({
  selector: 'sam-fal-autocomplete',
  templateUrl: 'fal-autocomplete.template.html'
})
export class SamFalAutocompleteComponent extends SamAutocompleteComponent {

  @ViewChild('input') input;
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

  }
  clearText() {
    this.input = '';
  }
}

