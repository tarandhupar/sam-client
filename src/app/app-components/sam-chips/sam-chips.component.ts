import { SamAutocompleteMultiselectComponent } from "sam-ui-elements/src/ui-kit/form-controls/autocomplete-multiselect/autocomplete-multiselect.component"; 
import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, Optional, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators} from "@angular/forms";
import {SamFormService} from 'sam-ui-elements/src/ui-kit/form-service';
import { AutocompleteService } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/core';

@Component({
    selector: 'sam-chips',
    templateUrl: 'sam-chips.template.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SamChipsComponent),
        multi: true
    }],
    animations: [
        trigger('dropdown', [
          transition('void => *', [
            animate('.15s ease-in-out', keyframes([
              style({filter:'blur(3px)', height: '0', opacity: '0.5',  offset: 0}),
              style({filter:'blur(0px)', height: '*', opacity: '1',  offset: 1.0})
            ]))
          ]),
          transition('* => void', [
            animate('.1s ease-out', keyframes([
              style({height: '*', opacity: '1', offset: 0}),
              style({height: '0', opacity: '0', offset: 1.0})
            ]))
          ])
        ]),
        trigger('label', [
          transition('void => *', [
            animate('.15s ease-in-out', keyframes([
              style({transform: 'scale(0)', filter:'blur(3px)', opacity: '0.5',  offset: 0}),
              style({transform: 'scale(1)', filter:'blur(0px)', opacity: '1',  offset: 1.0})
            ]))
          ]),
          transition('* => void', [
            animate('.1s ease-out', keyframes([
              style({filter:'blur(0px)', opacity: '1', offset: 0}),
              style({filter:'blur(3px)', opacity: '0', offset: 1.0})
            ]))
          ])
        ])
    ]
})
export class SamChipsComponent extends SamAutocompleteMultiselectComponent{
    constructor(@Optional() service: AutocompleteService,
    ref: ChangeDetectorRef,
    samFormService:SamFormService){
        super(service,ref,samFormService);
    }
    selectOnEnter(event) {
        if (event.keyCode== '13') {
            let obj = {};
            obj[this.keyValueConfig.keyProperty] = event.target.value;
            obj[this.keyValueConfig.valueProperty] = event.target.value;
            this.selectItem(obj);
            this.clearSearch();
        }
        return event;
      }
}