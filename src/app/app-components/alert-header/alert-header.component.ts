import { Component } from '@angular/core';
import { SystemAlertsService } from 'api-kit';
import { Cookie } from 'ng2-cookies'

@Component({
  selector: 'alertHeader',
  templateUrl: 'alert-header.template.html',
  styles: [ require('./alert-header.style.scss') ]
})
export class AlertHeaderComponent {

  public REFRESH_INTERVAL_MINUTES = 10;

  private intervalId: any = null;
  private alerts: any[] = [];
  private alertClass: string;

  constructor(private systemAlerts: SystemAlertsService) { }

  ngOnInit(){
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
    return this.alerts.length;
  }

  onDismissClick() {
    Cookie.set('dismissAlerts', 'true', 0);
    clearInterval(this.intervalId);
    this.alerts = [];
  }

  fetchAlerts() {
    this.systemAlerts.getAll().subscribe(alerts => {
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
