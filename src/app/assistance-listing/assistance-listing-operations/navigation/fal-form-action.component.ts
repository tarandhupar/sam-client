import {Component, EventEmitter, Output} from "@angular/core";

@Component({
  moduleId: __filename,
  selector: 'fal-form-action',
  templateUrl: 'fal-form-action.template.html'
})

export class FALFormActionComponent {
  @Output() cancel: EventEmitter<string> = new EventEmitter<string>();
  @Output() saveExit: EventEmitter<string> = new EventEmitter<string>();
  @Output() saveContinue: EventEmitter<string> = new EventEmitter<string>();

  onCancelClick() {
    this.cancel.emit();
  }

  onSaveExitClick() {
    this.saveExit.emit();
  }

  onSaveContinueClick() {
    this.saveContinue.emit();
  }
}
