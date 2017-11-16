import { Component, NgZone, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Alert } from "./alert.model";
import { SystemAlertsService } from "../../api-kit/system-alerts/system-alerts.service";
import { Observable } from "rxjs";
import { Cookie } from 'ng2-cookies';
import moment = require("moment");
import { AlertFooterService } from "../app-components/alert-footer/alert-footer.service";
import { AlertItemComponent } from "./alert-item/alert-item.component"
import { IAMService } from "api-kit";
import { UserAccessService } from "../../api-kit/access/access.service";
import { UserAccessModel } from "../role-management/access.model";
import { Location } from "@angular/common";

export const ALERTS_PER_PAGE: number = 5;

@Component({
  providers: [ IAMService, UserAccessService ],
  templateUrl: 'alerts.template.html'
})
export class AlertsPage {

  alertBeingEdited: Alert = null;
  alerts:Alert[] = [];
  _totalAlerts:number;
  links : any;
  alertmessage : string = '';

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
    options:   []
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

  user = null;

  states = {
    isSignedIn: false,
    menu: false,
    isCreate: false,
    isEdit: false
  };

  showModalWindow: boolean = false;
  modalWindowConfig = {
    type: "warning",
    description: "Are you sure you want to expire this alerts? This action effective immediately and cannot be undone",
    title: "Confirm Expiration"
  };
  curAlertIndex: number;
  expireModalConfirm: boolean = false;
  @ViewChild('expireModal') expireModal;
  @ViewChildren('alertItem') alertComponents: QueryList<AlertItemComponent>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertsService: SystemAlertsService,
              private alertFooterService: AlertFooterService,
              private zone: NgZone,
              private api: IAMService,
              private role: UserAccessService,
              private _location: Location) {
  }


  isAdmin() {
    // Will leverage to admin role later when the RM service is ready
    return this.states.isSignedIn;
  }

  isCreate(){
    return this.states.isCreate;
  }

  isEdit(){
    return this.states.isEdit;
  }

  showClassSelector() {
    return SHOW_OPTIONAL === 'true' || ENV === 'development';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      if(param['status']) {this.filters.statuses = [param['status']];}
      if(param['type']) {
        this.filters.types = [param['type']];
        if(param['type'] === 'WageDetermination') this.filters.types = ['Wage Determination'];
      }
    });
    this.loadAlertType();
    this.doSearch();

  }

  loadAlertType(){
    this.alertsService.getAlertTypes().subscribe(res => {
      this.types.options = [];
      res.forEach(type => {this.types.options.push({value: type, label: type, name: type.toLowerCase()});});
    }, err => {
      this.types.options = [
        {value: 'Error', label: 'Error', name: 'error'},
        {value: 'Informational', label: 'Informational', name: 'informational'},
        {value: 'Warning', label: 'Warning', name: 'warning'},
        {value: 'Wage Determination', label: 'Wage Determination', name: 'wage determination'},
      ]
    });
  }

  onNewAlertsReceived(alerts) {
    this._totalAlerts = alerts.total;
    this.links = alerts._links;

    this.states.isCreate = this.links.hasOwnProperty('create');
    this.states.isEdit = this.links.hasOwnProperty('edit');
    if(this.states.isCreate || this.states.isEdit){
      this.states.isSignedIn = true;
    }
    if (alerts.alerts && alerts.alerts.length) {
      this.alerts = alerts.alerts.map(alert => Alert.FromResponse(alert));
    } else {
      this.alerts = [];
      this.alertmessage = 'No results found for selected criteria. Please use filters to expand the search results.';
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
  defaultTypes() { return ['Error', 'Informational', 'Warning', 'Wage Determination']; }
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
      title:"The alerts service encountered an error.",
      description:"",
      type:'error',
      timer:3200
    });
  }

  isoNow() {
    return moment().format('YYYY-MM-DDTHH:mm:ss');
  }

  exitEditMode() {
    this.alertBeingEdited = null;
  }

  onAlertEdit(alert) {
    this.alertBeingEdited = alert;
  }

  onShowExpireModal(alertIndex) {
    this.curAlertIndex = alertIndex;
    this.expireModal.openModal();
  }

  onExpireConfirm(){
    this.expireModalConfirm = true;
    this.expireModal.closeModal();

    let alert = this.alerts[this.curAlertIndex];
    alert.setEndDate(this.isoNow());
    this.onEditAlertAccept(alert);

  }

  onExpireCancel(){
    if(!this.expireModalConfirm){
      this.alertComponents.toArray()[this.curAlertIndex].resetExpireSwitch();
    }else{
      this.expireModalConfirm = false;
    }
  }
}
