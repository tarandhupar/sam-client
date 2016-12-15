import {Input, Component, OnInit} from '@angular/core';
import {Alert} from "../alert.model";

@Component({
  selector: 'alert-edit',
  templateUrl: 'alert-edit.template.html'
})
export class AlertEditComponent implements OnInit {

  @Input() alert: Alert;
  @Input() mode: string;

  constructor() {

  }

  ngOnInit() {
    if (!this.mode) {
      throw new Error('[mode] must be set for "alert-item" (either "edit" or "add")');
    }
  }

  onPublishClick() {

  }

  onSaveDraftClick() {

  }
}
