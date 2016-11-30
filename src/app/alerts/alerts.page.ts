import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Alert} from "./alert.model";

@Component({
  providers: [ ],
  styleUrls: [ 'alerts.style.css' ],
  templateUrl: 'alerts.template.html'
})
export class AlertsPage {

  alerts:[Alert];
  MAX_ALERTS
  currentPage: number = 3;
  totalPages: number = 8;

  filterValue: any = {
    status: null,
    type: null,
    date: null
  };

  statuses = ["Active", "Inactive"];
  types = ["Critical", "Warning", "Information"];
  datesPublished = ["Last 30 Days", "Last 90 Days", "Last 6 Months", "Last 1 Year"];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    var temp = this.route.snapshot.data['alerts'];
    this.alerts = temp.map(alert => {
      //return alert;
      return Alert.FromResponse(alert);
    });
  }

  alertsTotal() {
    return "Need paging capability";
  }
}
