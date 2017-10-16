import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  @Input() section: string = 'system-information';
  @Input() active: boolean = true;
  @Input('group') form: FormGroup;
}
