import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'review',
  templateUrl: './review.component.html',
})
export class ReviewComponent {
  @Input() form: FormGroup;
  @Input() active: boolean = false;
  @Output() onEdit: EventEmitter<string> = new EventEmitter();

  field(key: string = '') {
    if(this.form.get(key)) {
      return this.form.get(key).value;
    }

    return '';
  }

  edit(section: string) {
    if(section) {
      this.onEdit.emit(section);
    }
  }
}
