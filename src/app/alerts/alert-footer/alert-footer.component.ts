import { Component } from '@angular/core';
import { SystemAlertsService } from 'api-kit';
import { Cookie } from 'ng2-cookies'
import { Router } from "@angular/router";
import {SYSTEM_ALERTS_PAGE_PATH} from "../alerts.route";
import {AlertFooterService} from "./alert-footer.service";

@Component({
  selector: 'alertFooter',
  templateUrl: 'alert-footer.template.html'
})
export class AlertFooterComponent {

  //private alerts: any = [];
  private alerts = [];

  constructor(private alertFooterService: AlertFooterService) {

  }

  ngOnInit() {
    this.refreshAlerts();
  }

  ngOnDestroy() {

  }

  dismissFooterAlert(i){
    this.alertFooterService.dismissFooterAlert(i);
    this.refreshAlerts();
  }

  refreshAlerts(){
    this.alerts = this.alertFooterService.getAlerts();
  }

}
