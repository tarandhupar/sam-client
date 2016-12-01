import { Component } from '@angular/core';
import {ActivatedRoute, Router, NavigationExtras} from "@angular/router";
import {Alert} from "./alert.model";
import {SYSTEM_ALERTS_PAGE_PATH} from "./alerts.route";
import {SystemAlertsService} from "../../api-kit/system-alerts/system-alerts.service";
import {ERROR_PAGE_PATH} from "../application-content/error/error.route";
import {Observable} from "rxjs";

export const ALERTS_PER_PAGE: number = 5;

@Component({
  providers: [ ],
  styleUrls: [ 'alerts.style.css' ],
  templateUrl: 'alerts.template.html'
})
export class AlertsPage {

  alerts:Alert[] = [];

  currentPage: number = this.defaultPage();
  sortField = this.defaultSort();

  filters: any = {
    statuses: this.defaultStatuses(),
    types: this.defaultTypes(),
    datePublished: this.defaultDatePublished()
  };

  statuses = [
    { label: 'Active', value: 'active'},
    { label: 'Inactive', value: 'inactive' }
  ];

  types = [
    { label: 'Informations', value: 'informational' },
    { label: 'Error', value: 'error' },
    { label: 'Warning', value: 'warning' }
  ];
  datesPublished = [
    {label: "Last 30 Days", value: '30d'},
    {label: "Last 90 Days", value: '90d'},
    {label: "Last 6 Months", value: '1m'},
    {label: "Last 1 Year", value: '1y'},
    {label: "All", value: 'all'}
  ];
  sortFields = [
    {label: 'Published date (most recent first)', value: 'pdd'},
    {label: 'Published date (oldest first)', value: 'pda'},
    {label: 'End date (most recent first)', value: 'edd'},
    {label: 'End date (oldest first)', value: 'eda'},
  ];

  constructor(private route: ActivatedRoute, private router: Router, private alertsService: SystemAlertsService) {
    route.queryParams.subscribe(params => {
      const page = params['page'];
      if (page) {
        this.currentPage = parseInt(page);
      } else {
        this.currentPage = this.defaultPage();
      }

      const statuses = params['statuses'];
      if (statuses) {
        this.filters.statuses = statuses.split(',');
      } else {
        this.filters.statuses = this.defaultStatuses();
      }

      const types = params['types'];
      if (types) {
        this.filters.types = types.split(',');
      } else {
        this.filters.types = this.defaultTypes();
      }

      this.filters.datePublished = params['date_published'] || this.defaultDatePublished();
      this.sortField = params['sort'] || this.defaultSort();

      this.doDelayedSearch();
    });
  }

  ngOnInit() {
    // const temp = this.route.snapshot.data['alerts'];
    // this.alerts = temp.map(alert => {
    //   return Alert.FromResponse(alert);
    // });
  }

  doSearch() {
    this.getAlerts().catch(err => {
        this.router.navigate([ERROR_PAGE_PATH]);
        return Observable.of(err);
      })
      .subscribe(alerts => {
        this.alerts = alerts.map(alert => Alert.FromResponse(alert));
      });
  }

  doDelayedSearch() {
    this.getAlerts().last().catch(err => {
      this.router.navigate([ERROR_PAGE_PATH]);
      return Observable.of(err);
    })
    .subscribe(alerts => {
      this.alerts = alerts.map(alert => Alert.FromResponse(alert));
    })
  }

  getAlerts() {
    let offset = (this.currentPage - 1) * ALERTS_PER_PAGE;
    return this.alertsService.get(ALERTS_PER_PAGE, offset, this.filters.statuses, this.filters.types, this.filters.datePublished, this.sortField);
  }

  onParamChanged(page) {
    let queryParams: any = {};

    if (this.filters.datePublished) {
      queryParams.date_published = this.filters.datePublished;
    }

    if (this.filters.statuses.length) {
      queryParams.statuses = this.filters.statuses.join(',');
    }

    if (this.filters.types.length) {
      queryParams.types = this.filters.types.join(',')
    }

    queryParams.sort_field = this.sortField;
    queryParams.page = page || this.currentPage;

    let extras: Object = { queryParams: queryParams };
    this.router.navigate([SYSTEM_ALERTS_PAGE_PATH], extras);
  }

  defaultSort() { return 'pda'; }
  defaultStatuses() { return ['active']; }
  defaultTypes() { return ['error', 'informational', 'warning']; }
  defaultPage() { return 1; }
  defaultDatePublished() { return 'all'; }

  totalAlerts(): number {
    // TODO: get real value
    return 100;
  }

  totalPages(): number {
    return this.totalAlerts() / ALERTS_PER_PAGE;
  }
}
