import { Component } from '@angular/core';
import {ActivatedRoute, Router, NavigationExtras} from "@angular/router";
import {Alert} from "./alert.model";
import {SYSTEM_ALERTS_PAGE_PATH} from "./alerts.route";

const ALERTS_PER_PAGE: number = 5;

@Component({
  providers: [ ],
  styleUrls: [ 'alerts.style.css' ],
  templateUrl: 'alerts.template.html'
})
export class AlertsPage {

  alerts:[Alert];
  currentPage: number = 0;
  totalPages: number = 5;

  filters: any = {
    statuses: ['Active'],
    types: ['Critical'],
    datePublished: null
  };

  statuses = ["Active", "Inactive"];
  types = ["Critical", "Warning", "Information"];
  datesPublished = ["Last 30 Days", "Last 90 Days", "Last 6 Months", "Last 1 Year"];
  sortFields = ['Status', 'Type', 'Date Published'];
  sortField = 'Status';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.currentPage = 1;
    route.params.subscribe(params => {
      this.currentPage = params['offset'] / ALERTS_PER_PAGE;
    });
  }

  ngOnInit() {
    const temp = this.route.snapshot.data['alerts'];
    this.alerts = temp.map(alert => {
      //return alert;
      return Alert.FromResponse(alert);
    });
  }

  onParamChanged() {
    let extras: any = {
      queryParams: {
        limit: ALERTS_PER_PAGE,
        offset: ALERTS_PER_PAGE * this.currentPage,
      }
    };

    if (this.filters.datePublished) {
      extras.queryParams.datePublished = this.filters.datePublished;
    }

    if (this.filters.statuses.length) {
      extras.queryParams.statuses = this.filters.statuses;
    }

    if (this.filters.types.length.length) {
      extras.queryParams.types = this.filters.types;
    }

    this.router.navigate([SYSTEM_ALERTS_PAGE_PATH], extras);
  }

  alertsTotal() {
    return "Need paging capability";
  }
}
