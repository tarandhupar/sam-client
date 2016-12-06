import { Component, Input, Output, ViewChild, EventEmitter  } from '@angular/core';
import { LabelWrapper } from '../wrapper/label-wrapper.component';
import { OptionsType } from '../types';

/**
 * The <samMultiSelect> component is a multi-select/options group compliant
 *
 * @Input options: [{Option}] - the array of checkbox values and labels (see OptionsType)
 * @Input label: string - the innerHtml of <fieldset>
 * @Input name: string - semantic description for the component
 * @Input hint: string - helpful text for the using the component
 * @Input errorMessage: string - red error message
 *
 */
@Component({
  selector: 'samMultiSelect',
  template: `
  <labelWrapper [label]="label" [name]="name" [hint]="hint" [errorMessage]="errorMessage">
    <select #select multiple (change)="change($event.target.options)" class="sam-multiselect" [disabled]="disabled">
      <option *ngFor="let item of options" [value]="item.value">
        {{item.name}}
      </option>
    </select>
  </labelWrapper>
  `
})
export class SamMultiSelectComponent {
  @ViewChild('select') selectElRef;
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() disabled:boolean;
  selectedValues = [];
  constructor() { console.clear(); }
  ngAfterViewInit() {
    this.updateSelectList();
  }
  updateSelectList() {
    let options = this.selectElRef.nativeElement.options;
    for(let i=0; i < options.length; i++) {
      options[i].selected = this.selectedValues.indexOf(options[i].value) > -1;
    }
  }
  change(options) {
    this.selectedValues = Array.apply(null,options)  // convert to real Array
      .filter(option => option.selected)
      .map(option => option.value);
  }

}
