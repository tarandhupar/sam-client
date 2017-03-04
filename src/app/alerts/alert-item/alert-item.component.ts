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
  @Input() isEdit: boolean;
  @Input() editDisabled: boolean = false;
  @Input() alertIndex: number;

  @Output() edit: EventEmitter<Alert> = new EventEmitter<Alert>();
  @Output() showExpireModal: EventEmitter<number> = new EventEmitter<number>();


  expireAlert: boolean = false;

  resetExpireSwitch() {
    this.expireAlert = false;
  }

  onEditClick() {
    this.edit.emit(this.alert);
  }

  formatDate(dateString) {
    if (dateString) {
      return moment(dateString).format('MMM DD, YYYY');
    } else {
      return '--';
    }
  }

  publishedDate() {
    return this.formatDate(this.alert.publishedDate());
  }

  endDate() {
    let dateString = this.alert.endDate();
    if (dateString) {
      return moment(dateString).format('MMM DD, YYYY');
    } else if (this.alert.isExpiresIndefinite()) {
      return 'Indefinite';
    } else {
      return '--';
    }
  }

  isActiveAlert():boolean{return this.alert.status() === 'Active';}
  isExpiredAlert():boolean{return this.alert.status() === 'Expired';}

  OnSwitchChange(val){
    // There is only switch on for expire alert
    this.expireAlert = true;
    this.showExpireModal.emit(this.alertIndex);
  }

}
