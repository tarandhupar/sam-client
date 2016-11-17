import { Component, Input, Output, ViewChild, EventEmitter  } from '@angular/core';
import { LabelWrapper } from '../wrapper/label-wrapper.component';
import { OptionsType } from '../types';

/**
 * The <samSelect> component is a select/options group compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input/@Output model - the bound value of the component
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
  <select #select multiple (change)="change($event.target.options)" style="height:auto">
    <option *ngFor="let item of myOptions" [value]="item.value">
      {{item.name}}
    </option>
  </select>
  <button (click)="remove()">Remove</button>
  `
})
export class SamMultiSelectComponent {
  @ViewChild('select') selectElRef;
  @Input() myOptions = [];
  @Output() selectionUpdate = new EventEmitter<any>();
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
      .map(option => option.value)
  }

  //remove button should be moved out
  remove(){
    //replace values without losing reference in parent 
    var selectedValues = this.selectedValues;
    var filteredArray = this.myOptions.filter(function( obj ) {
      for(var idx in selectedValues){
        if(selectedValues[idx] == obj.value){
          return false;
        }
      }
      return true;
    });
    this.myOptions.length = 0;
    [].push.apply(this.myOptions,filteredArray);
    this.selectionUpdate.emit(this.myOptions);
  }

}
