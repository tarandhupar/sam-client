import {Input, Output, Component, EventEmitter} from '@angular/core';
import {Alert} from "../alert.model";
import {SystemAlertsService} from "api-kit/system-alerts/system-alerts.service";
import {ERROR_PAGE_PATH} from "../../application-content/error/error.route";
import {Router} from "@angular/router";

@Component({
  selector: 'alert-item',
  templateUrl: 'alert-item.template.html'
})
export class AlertItemComponent {

  @Input() alert: Alert;
  @Output() delete: EventEmitter<Alert> = new EventEmitter<Alert>();
  @Output() edit: EventEmitter<Alert> = new EventEmitter<Alert>();
  @Output() draft: EventEmitter<Alert> = new EventEmitter<Alert>();
  @Output() publish: EventEmitter<Alert> = new EventEmitter<Alert>();
  isEditing: boolean = false;
  isDeleting: boolean = false;

  constructor(private alertsService: SystemAlertsService, private router: Router) {

  }

  onEditClick() {
    this.isEditing = true;
  }

  onDeleteClick() {
    this.isDeleting = true;
  }

  onDeleteConfirmClick() {
    this.alertsService.deleteAlert(this.alert.id())
      .subscribe(
        data => {
          this.delete.emit(this.alert);
        },
        error => {
          console.error('Error while deleting alert: ', error);
          this.router.navigate([ERROR_PAGE_PATH]);
        }
    );
  }

  onCancelDeleteClick() {
    this.isDeleting = false;
  }

  onEditAlertCancel() {
    this.isEditing = false;
  }

  onEditAlertPublish(alert: Alert) {
    this.publish.emit(alert);
    //this.alertsService.updateAlert(alert.raw());
  }

  onEditAlertDraft(alert) {
    this.draft.emit(alert);
  }
}
