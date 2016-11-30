import { Input, Component } from '@angular/core';
import {Alert} from "../alert.model";

@Component({
  selector: 'alert-item',
  styleUrls: [ 'alert-item.style.css' ],
  templateUrl: 'alert-item.template.html'
})
export class AlertItemComponent {

  @Input() alert: Alert;

  constructor() {

  }
}
