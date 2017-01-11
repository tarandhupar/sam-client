import {Input, Output, Component, EventEmitter} from '@angular/core';
import {Alert} from "../alert.model";
import * as moment from 'moment/moment';

@Component({
  selector: 'alert-item',
  templateUrl: 'alert-item.template.html'
})
export class AlertItemComponent {

  @Input() alert: Alert;
  @Input() isAdmin: boolean;
  @Output() edit: EventEmitter<Alert> = new EventEmitter<Alert>();
  @Input() editDisabled: boolean = false;

  onEditClick() {
    this.edit.emit(this.alert);
  }

  formatDate(dateString) {
    if (dateString) {
      return moment(dateString).format('MMM DD, YYYY');
    } else if (this.alert.isExpiresIndefinite()) {
      return 'Indefinite';
    } else {
      return '--';
    }
  }

  publishedDate() {
    return this.formatDate(this.alert.publishedDate());
  }

  endDate() {
    return this.formatDate(this.alert.endDate());
  }
}
