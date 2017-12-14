import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamUploadComponent),
  multi: true
};

@Component({
  selector: 'sam-upload',
  providers: [VALUE_ACCESSOR],
  templateUrl: './upload.template.html',
})
export class SamUploadComponent implements ControlValueAccessor
{
  @Input()
  public disabled: boolean = false;

  @Input()
  public name: string = null;

  @ViewChild('file')
  private fileInput: ElementRef;

  public _file: File = null;

  // ControlValueAccessor overrides
  private onChange: Function;
  private onTouched: Function;

  constructor() {

  }

  onFilesChange(file: File) {
    this._file = file;
    this.onTouched();
    this.onChange(file);
  }

  deselectFile() {
    this._file = null;
    // clear the input's internal value, or it will not emit the change event if we select a file, deselect that file,
    // and select the same file again
    this.fileInput.nativeElement.value = '';
  }

  // BEGIN ControlValueAccessor overrides
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value: File) {
    this._file = value;
  }
  // END ControlValueAccessor overrides
}
