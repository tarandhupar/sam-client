import {Input, Output, Component, EventEmitter} from '@angular/core';
import {Alert} from "../alert.model";

@Component({
  selector: 'alert-item',
  templateUrl: 'alert-item.template.html'
})
export class AlertItemComponent {

  @Input() alert: Alert;
  @Output() edit: EventEmitter<Alert> = new EventEmitter<Alert>();
  @Input() editDisabled: boolean = false;

  onEditClick() {
    this.edit.emit(this.alert);
  }
}
