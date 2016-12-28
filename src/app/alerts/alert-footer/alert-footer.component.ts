import { Component } from '@angular/core';
import {AlertFooterService} from "./alert-footer.service";

@Component({
  selector: 'alertFooter',
  templateUrl: 'alert-footer.template.html'
})
export class AlertFooterComponent {

  private alerts = [];

  constructor(private alertFooterService: AlertFooterService) { }

  ngOnInit() {
    this.refreshAlerts();
  }

  ngOnDestroy() { }

  dismissFooterAlert(i){
    this.alertFooterService.dismissFooterAlert(i);
    this.refreshAlerts();
  }

  refreshAlerts(){
    this.alerts = this.alertFooterService.getAlerts();
  }

}
