import { Component } from '@angular/core';
import { SystemAlertsService } from 'api-kit';
import { Cookie } from 'ng2-cookies'
import { Router } from "@angular/router";
import {SYSTEM_ALERTS_PAGE_PATH} from "../alerts.route";
import {Alert} from "../alert.model";

@Component({
  selector: 'alert-header',
  templateUrl: 'alert-header.template.html'
})
export class AlertHeaderComponent {

  public REFRESH_INTERVAL_MINUTES = 10;

  private intervalId: any = null;
  private alerts: any = [];
  private alertsPath: string = SYSTEM_ALERTS_PAGE_PATH;

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

  alertClass() {
    return this.alerts[0].alertClass();
  }

  showAlerts() {
    return this.alerts.length && !this.router.isActive(SYSTEM_ALERTS_PAGE_PATH, false);
  }

  onDismissClick() {
    Cookie.set('dismissAlerts', 'true', 0);
    clearInterval(this.intervalId);
    this.alerts = [];
  }

  fetchAlerts() {
    const MAX_ALERTS: number = 2;
    this.systemAlerts.getActive(MAX_ALERTS)
      .subscribe(alerts => {
      if (!alerts || !alerts._embedded || !alerts._embedded.alertList || !alerts._embedded.alertList.length) {
        this.alerts = [];
        return;
      }
      let alert = [];

      alert = alerts._embedded.alertList;
      alert = alert.map(res => {
        return Alert.FromResponse(res);
      });

      let firstSeverity = alert[0].severity().toLowerCase();

      //Only display two errors if there is more than one error and they are both critical
      //(We didn't want two different colors of messages)
      this.alerts = alert.slice(0, 1);

      if (alerts._embedded.alertList.length > 1) {
        let secondSeverity = alert[1].severity().toLowerCase();
        if (secondSeverity === 'error' && firstSeverity === 'error') {
          this.alerts = alert.slice(0, 2);
        }
      }
    }, error => {
      console.error('Encountered an error fetching alerts: ', error);
    });
  }

}
