import {Component, Input, Output, ViewChild, EventEmitter, forwardRef} from '@angular/core';
import { LabelWrapper } from '../wrapper/label-wrapper.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamTextComponent),
  multi: true
};

/**
 *
 */
@Component({
  selector: 'samText',
  template: `
      <labelWrapper [label]="label" [name]="name" [hint]="hint" [errorMessage]="errorMessage">
        <input type="text" [value]="value" [attr.id]="name" [disabled]="disabled" (change)="onInputChange($event.target.value)">
      </labelWrapper>
  `,
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamTextComponent implements ControlValueAccessor {
  @Input() value: string;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean;

  onChange: any = () => { };
  onTouched: any = () => { };

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor() {

  }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samText> requires a [name] parameter for 508 compliance");
    }
  }

  onInputChange(value) {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value;
  }
}
