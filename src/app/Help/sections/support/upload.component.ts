import { LabelWrapper } from '../../../../sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component';

import {
  AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, forwardRef, OnChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamUploadComponent),
  multi: true
};

@Component({
  selector: 'sam-upload',
  providers: [VALUE_ACCESSOR],
  template: `
    <sam-label-wrapper [name]="name" [label]="label" [hint]="hint" [errorMessage]="errorMessage">
      <div class="text-center" style="padding: 2em 1em; border: 1px solid #4f4f4f" sam-drag-drop
           (filesChangeEmiter)="onFilesChange($event)">
        <ng-container *ngIf="!_file">
          <i class="fa fa-cloud-upload"></i> &nbsp;Drag and drop files here, or <a (click)="file.click()">browse</a>
        </ng-container>
        <ng-container *ngIf="_file">
          <div class="sam-ui mini label">
            <div class="label">
              <span class="selected-category">
                {{ _file.name }} &nbsp;
                <i class="icon close fa fa-times" (click)="deselectFile()"></i>
              </span>
            </div>
          </div>   
        </ng-container>
        
        <!-- Hidden input to trigger the browser file selector -->
        <input type="file" #file [attr.id]="name" ngModel class="hide" (change)="onFilesChange($event.target.files[0])">
      </div>
    </sam-label-wrapper>
  `
})
export class SamUploadComponent extends LabelWrapper
  implements OnChanges, AfterViewInit, AfterViewChecked, ControlValueAccessor
{
  private _file: File = null;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  ngOnChanges(changes) {
    super.ngOnChanges(changes);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngAfterViewChecked() {
    super.ngAfterViewChecked();
  }

  onFilesChange(file: File) {
    this._file = file;
    this.onChange(file);
  }

  deselectFile() {
    this._file = null;
  }

  /* ControlValueAccessor BoilerPlate */
  private onChange: any = () => { };
  private onTouched: any = () => { };

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // TODO: implement disabled functionality for uploads
  // setDisabledState(disabled) { this.disabled = disabled; }
  writeValue(value: File) {
    this._file = value;
  }
}
