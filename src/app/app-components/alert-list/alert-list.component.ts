import { Component } from '@angular/core';
import { SystemAlertsService } from 'api-kit';
import { Cookie } from 'ng2-cookies'

@Component({
  selector: 'alertList',
  templateUrl: 'alert-list.template.html',
  styleUrls: [ 'alert-list.style.css' ]
})
export class AlertListComponent {

  public ALERT_REFRESH_INTERVAL_MINUTES = 10;
  private intervalId: any = null;
  private showDescriptions: boolean = false;

  private alerts: any[] = [];

  constructor(private systemAlerts: SystemAlertsService) { }

  ngOnInit(){
    if (Cookie.get('dismissAlerts')) {
      this.alerts = [];
    } else {
      this.intervalId = setInterval(() => {
        this.fetchAlerts();
      }, 1000 * 60 * this.ALERT_REFRESH_INTERVAL_MINUTES);

      this.fetchAlerts();
    }
  }

  ngOnDestroy() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  onDismiss() {
    Cookie.set('dismissAlerts', 'true', 0);
    clearInterval(this.intervalId);
    this.alerts = [];
  }

  onExpand() {
    this.showDescriptions = !this.showDescriptions;
  }

  mapResponseToAlertConfig(res) {
    let getAlertTypeForSeverity = {
      'WARNING': 'warning',
      'INFO': 'info',
      'ERROR': 'error'
    };

    // default to error if the response does not have a severity set, or severity is invalid
    let type = getAlertTypeForSeverity[res.severity] || 'error';

    return {
      type: type,
      title: res.title,
      description: res.description
    };
  }

  fetchAlerts() {
    this.systemAlerts.getAll().subscribe(alerts => {
      this.alerts = alerts.map(this.mapResponseToAlertConfig);
    }, error => {
      console.error('Encountered an error fetching alerts: ', error);
    });
  }
}
