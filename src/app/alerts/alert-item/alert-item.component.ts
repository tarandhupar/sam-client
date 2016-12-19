import {Input, Output, Component, EventEmitter} from '@angular/core';
import {Alert} from "../alert.model";
import {SystemAlertsService} from "api-kit/system-alerts/system-alerts.service";

@Component({
  selector: 'alert-item',
  templateUrl: 'alert-item.template.html'
})
export class AlertItemComponent {

  @Input() alert: Alert;
  @Output() delete: EventEmitter<Alert> = new EventEmitter<Alert>();
  @Output() edit: EventEmitter<Alert> = new EventEmitter<Alert>();
  isEditing: boolean = false;

  constructor(private alertsService: SystemAlertsService) {

  }

  onEditClick() {
    this.isEditing = true;
  }

  onDeleteClick() {
    this.delete.emit(this.alert);
  }

  onEditAlertCancel() {
    this.isEditing = false;
  }

  onEditAlertPublish(alert: Alert) {
    this.alertsService.updateAlert(
      alert.id(),
      alert.archived(),
      alert.severity(),
      alert.publishedDate(),
      alert.endDate(),
    )
  }

  onEditAlertDraft(alert) {

  }
}
