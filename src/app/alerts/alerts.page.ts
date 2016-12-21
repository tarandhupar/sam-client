import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Alert} from "./alert.model";
import {SystemAlertsService} from "../../api-kit/system-alerts/system-alerts.service";
import {ERROR_PAGE_PATH} from "../application-content/error/error.route";
import {Observable} from "rxjs";

export const ALERTS_PER_PAGE: number = 5;

@Component({
  providers: [ ],
  templateUrl: 'alerts.template.html'
})
export class AlertsPage {

  isAdding: boolean = false;
  alerts:Alert[] = [];
  _totalAlerts:number;

  currentPage: number = this.defaultPage();
  sortField = this.defaultSort();

  filters: any = {
    statuses: this.defaultStatuses(),
    types: this.defaultTypes(),
    datePublished: this.defaultDatePublished()
  };

  statuses = {
    label: 'Status',
    options: [
      { label: 'Published and Active', value: 'N', name: 'active' },
      { label: 'Published and Inactive', value: 'Y', name: 'inactive' },
      { label: 'Draft', value: 'X', name: 'draft' }
    ]
  };

  types = {
    label: 'Types',
    options:   [
      { label: 'Informational', value: 'Informational', name: 'informational' },
      { label: 'Error', value: 'Error', name: 'error' },
      { label: 'Warning', value: 'Warning', name: 'warning' }
    ]
  };

  datesPublished = [
    {label: "Last 30 Days", value: '30d'},
    {label: "Last 90 Days", value: '90d'},
    {label: "Last 6 Months", value: '6m'},
    {label: "Last 1 Year", value: '1y'},
    {label: "All", value: ''}
  ];
  sortFields = [
    {label: 'Published date (most recent first)', value: 'pdd'},
    {label: 'Published date (oldest first)', value: 'pda'},
    {label: 'End date (most recent first)', value: 'edd'},
    {label: 'End date (oldest first)', value: 'eda'},
  ];

  constructor(public router: Router, private alertsService: SystemAlertsService) {

  }

  ngOnInit() {
    this.doSearch();
  }

  doSearch() {
    this.getAlerts().catch(err => {
      this.router.navigate([ERROR_PAGE_PATH]);
      return Observable.of(err);
    })
    .subscribe(alerts => {
      this._totalAlerts = alerts.total;
      this.alerts = alerts.alerts.map(alert => Alert.FromResponse(alert));
    })
  }

  getAlerts() {
    let sort, order;
    if (this.sortField === 'pda' || this.sortField === 'pdd') {
      sort = 'published_date';
    } else {
      sort = 'end_date';
    }
    if (this.sortField === 'pdd' || this.sortField === 'edd') {
      order = 'desc';
    } else {
      order = 'asc';
    }
    let offset = (this.currentPage - 1) * ALERTS_PER_PAGE;
    return this.alertsService.getAll(ALERTS_PER_PAGE, offset, this.filters.statuses, this.filters.types, this.filters.datePublished, sort, order);
  }

  onParamChanged(page) {
    if (page) {
      this.currentPage = page;
    }
    this.doSearch();
  }

  defaultSort() { return 'pdd'; }
  defaultStatuses() { return ['N']; }
  defaultTypes() { return ['Error', 'Informational', 'Warning']; }
  defaultPage() { return 1; }
  defaultDatePublished() { return '30d'; }

  totalAlerts(): number {
    return this._totalAlerts;
  }

  totalPages(): number {
    return Math.floor(this._totalAlerts / ALERTS_PER_PAGE) + 1;
  }

  alertsStart(): number {
    return (this.currentPage-1) * ALERTS_PER_PAGE + 1;
  }

  alertsEnd(): number {
    return this.alertsStart() + this.alerts.length - 1;
  }

  onAddClick() {
    this.isAdding = true;
  }

  onAddAlertPublish(alert) {
    this.alertsService.createAlert(alert.raw()).subscribe(
      (data) => {
        this.isAdding = false;
      },
      (error) => {
        console.error('Error while adding alerts: ', error);
        this.router.navigate([ERROR_PAGE_PATH]);
      }
    );
  }

  onEditAlertPublish(alert) {
    //this.alertsService.updateAlert()
  }

  onAddAlertDraft(alert) {
    this.alertsService.createAlert(alert.raw());
    this.isAdding = false;
  }

  onAddAlertCancel() {
    this.isAdding = false;
  }
}
