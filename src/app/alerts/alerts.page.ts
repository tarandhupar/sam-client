import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { Alert } from "./alert.model";
import { SystemAlertsService } from "../../api-kit/system-alerts/system-alerts.service";
import { Observable } from "rxjs";
import { Cookie } from 'ng2-cookies';
import { AlertFooterService } from "./alert-footer/alert-footer.service";

export const ALERTS_PER_PAGE: number = 5;

@Component({
  providers: [ ],
  templateUrl: 'alerts.template.html'
})
export class AlertsPage {

  alertBeingEdited: Alert = null;
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
  };

  statusOptions = [
    { label: 'Active', value: 'Active', name: 'active' },
    { label: 'Expired', value: 'Expired', name: 'expired' }
  ];

  statusOptionsAdmin = [
    { label: 'Active', value: 'Active', name: 'active' },
    { label: 'Draft', value: 'Draft', name: 'draft' },
    { label: 'Expired', value: 'Expired', name: 'expired' }
  ];

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

  constructor(private router: Router, private alertsService: SystemAlertsService, private alertFooterService: AlertFooterService) {

  }

  userRole() {
    return Cookie.get('role') || 'other';
  }

  onRoleChange(val) {
    Cookie.set('role', val);
  }

  isAdmin() {
    return Cookie.get('role') === 'admin';
  }

  showClassSelector() {
    return SHOW_OPTIONAL === 'true' || ENV === 'development';
  }

  ngOnInit() {
    this.doSearch();
  }

  onNewAlertsReceived(alerts) {
    this._totalAlerts = alerts.total;
    if (alerts.alerts && alerts.alerts.length) {
      this.alerts = alerts.alerts.map(alert => Alert.FromResponse(alert));
    } else {
      this.alerts = [];
    }
  }

  doSearch() {
    this.getAlerts().subscribe((alerts) => this.onNewAlertsReceived(alerts));
  }

  getAlerts() : Observable<any> {
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
    // if this is a page change, the page parameter is > 1
    if (page) {
      this.currentPage = page;
    } else {
      this.currentPage = 1;
    }
    this.doSearch();
  }

  defaultSort() { return 'pdd'; }
  defaultStatuses() { return ['Active']; }
  defaultTypes() { return ['Error', 'Informational', 'Warning']; }
  defaultPage() { return 1; }
  defaultDatePublished() { return ''; }

  totalAlerts(): number {
    return this._totalAlerts;
  }

  totalPages(): number {
    return Math.floor((this._totalAlerts-1) / ALERTS_PER_PAGE) + 1;
  }

  alertsStart(): number {
    return (this.currentPage-1) * ALERTS_PER_PAGE + 1;
  }

  alertsEnd(): number {
    return this.alertsStart() + this.alerts.length - 1;
  }

  onAddAlertClick(alert) {
    this.alertBeingEdited = new Alert();
  }

  onAlertCancel() {
    this.exitEditMode();
  }

  onAddAlertAccept(alert) {
    this.alertsService.createAlert(alert.raw()).switchMap(() => this.getAlerts()).subscribe(
      (alerts) => {
        this.currentPage = 1;
        this.onNewAlertsReceived(alerts);
        this.exitEditMode();
      },
      () => this.showFooter()
    );
  }

  onEditAlertAccept(alert) {
    this.alertsService.updateAlert(alert.raw()).switchMap(() => this.getAlerts()).subscribe(
      (alerts) => {
        this.currentPage = 1;
        this.onNewAlertsReceived(alerts);
        this.exitEditMode();
      },
      () => this.showFooter()
    );
  }

  showFooter() {
    this.alertFooterService.registerFooterAlert({
      title:"A required service is unavailable",
      description:"",
      type:'error',
      timer:0
    });
    return Observable.throw(new Error("api error"));
  }

  exitEditMode() {
    this.alertBeingEdited = null;
  }

  onAlertEdit(alert) {
    this.alertBeingEdited = alert;
  }
}
