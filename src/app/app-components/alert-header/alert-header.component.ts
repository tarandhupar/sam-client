import { Component } from '@angular/core';
import { SystemAlertsService } from 'api-kit';
import { Cookie } from 'ng2-cookies'
import { Router } from "@angular/router";
import {SYSTEM_ALERTS_PAGE_PATH} from "../../application-content/alerts/alerts.route";

@Component({
  selector: 'alertHeader',
  templateUrl: 'alert-header.template.html'
})
export class AlertHeaderComponent {

  public REFRESH_INTERVAL_MINUTES = 10;

  private intervalId: any = null;
  private alerts: any[] = [];
  private alertClass: string;

  constructor(private systemAlerts: SystemAlertsService, private router: Router) {

  }

  ngOnInit() {

    if (Cookie.get('dismissAlerts')) {
      this.alerts = [];
    } else {
      this.intervalId = setInterval(
        () => {
          this.fetchAlerts();
        },
        1000 * 60 * this.REFRESH_INTERVAL_MINUTES
      );

      this.fetchAlerts();
    }
  }

  ngOnDestroy() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  showAlerts() {
    let alertsPath: RegExp = new RegExp(SYSTEM_ALERTS_PAGE_PATH + '$');
    return this.alerts.length && !this.router.url.match(alertsPath);
  }

  onDismissClick() {
    Cookie.set('dismissAlerts', 'true', 0);
    clearInterval(this.intervalId);
    this.alerts = [];
  }

  fetchAlerts() {
    const MAX_ALERTS: number = 2;
    this.systemAlerts.get(MAX_ALERTS)
      .map(alerts => alerts.map(alert => alert.content))
      .subscribe(alerts => {

      if (!alerts.length) {
        this.alerts = [];
        return;
      }

      let firstSeverity = alerts[0].severity.toLowerCase();

      // Only display two errors if there is more than one error and they are both critical
      // (We didn't want two different colors of messages)
      this.alerts = alerts.slice(0, 1);
      if (alerts.length > 1) {
        let secondSeverity = alerts[1].severity.toLowerCase();
        if (secondSeverity === 'error' && firstSeverity === 'error') {
          this.alerts = alerts.slice(0, 2);
        }
      }

      let alertClasses = {
        "success":"usa-alert-success",
        "warning":"usa-alert-warning",
        "error":"usa-alert-error",
        "info":"usa-alert-info"
      };

      this.alertClass = alertClasses[firstSeverity] || "usa-alert-error";
    }, error => {
      console.error('Encountered an error fetching alerts: ', error);
    });
  }
}
