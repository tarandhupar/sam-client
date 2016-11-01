import { Component } from '@angular/core';
import { SystemAlertsService } from 'api-kit';
import { Cookie } from 'ng2-cookies'

const NUM_MINUTES = 10;

@Component({
  selector: 'samAlertList',
  templateUrl: 'alert-list.template.html'
})
export class SamAlertListComponent {

  private intervalId: number;
  private showDescriptions: boolean = false;

  private alerts: any[] = [
    { type: 'danger', title: 'uh-oh', description: 'something went wrong with our servers' },
    { type: 'danger', title: 'uh-oh', description: 'something went wrong with our servers' },
    { type: 'danger', title: 'uh-oh', description: 'something went wrong with our servers' },
    { type: 'danger', title: 'uh-oh', description: 'something went wrong with our servers' },
  ];

  constructor(private systemAlerts: SystemAlertsService) {
  }

  ngOnInit(){
    if (!Cookie.get('dismissAlerts')) {
      this.intervalId = setInterval(() => {
        this.fetchAlerts();
      }, 1000 * 60 * NUM_MINUTES);

      this.fetchAlerts();
    }
  }

  onDismiss() {
    Cookie.set('dismissAlerts', 'true');
    clearInterval(this.intervalId);
    this.alerts = [];
  }

  onExpand() {
    this.showDescriptions = !this.showDescriptions;
  }

  mapResponseToAlertConfig(res) {
    let getAlertTypeForSeverity = {
      'success': 'success',
      'warning': 'warning',
      'info': 'info',
      'error': 'error'
    };

    // default to error if the response does not have a severity set
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
    });
  }
}
