import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  providers: [ ],
  templateUrl: 'alerts.template.html'
})
export class AlertsPage {

  alerts:[any];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    var temp = this.route.snapshot.data['alerts'];
    this.alerts = temp.map(alert => {
      return {
        type: alert.content.severity.toLowerCase(),
        description: alert.content.description,
        title: alert.content.title
      };
    });
  }

}
