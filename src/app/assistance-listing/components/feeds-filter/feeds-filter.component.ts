import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import moment = require("moment");

@Component({
  selector: 'feedsFilter',
  providers: [],
  templateUrl: 'feeds-filter.template.html',
})
export class FeedsFilterComponent {
  showALFilters:boolean = false;
  showALRequestFilters: boolean = false;
  showALPendingRequestFilters: boolean = false;

  @Input() defaultDomainOption: any;

  @Input() defaultEventOption: any;

  @Input() defaultPendingRequestsOption: any;

  @Output() domainFilterModelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() eventFilterModelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() pendingRequestsFilterModelChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() alRequestTypeModelChange: EventEmitter<any> = new EventEmitter<any>();

  // Active Checkbox config
  eventFilterModel: any = [];
  eventFilterConfig = {
    options: [
      {value: 'request', label: 'Requests', name: 'checkbox-request'},
    ],
    name: 'event-filter'
  };

  // Active Checkbox config
  pendingRequestsModel: any = [];
  pendingRequestFilterConfig = {
    options: [
      {value: 'pending-requests', label: 'Pending Requests Only', name: 'checkbox-pending-request'},
    ],
    name: 'pending-request-filter'
  };

  // Domain Checkbox config
  domainFilterModel: any = [];
  domainFilterConfig = {
    options: [
      {value: 'al', label: 'Assistance Listing', name: 'checkbox-al'}
    ],
    name: 'domain-filter'
  };

  // AL Request Type Checkbox config
  alRequestTypeModel: any = [];
  alRequestTypeConfig = {
    options: [
      {value: 'archive_request', label: 'Archive', name: 'checkbox-al-archive-request'},
      {value: 'unarchive_request', label: 'Unarchive', name: 'checkbox-al-unarchive-type'},
      {value: 'title_request', label: 'Title Change', name: 'checkbox-al-title-request'},
      {value: 'agency_request', label: 'Agency Change', name: 'checkbox-al-agency-request'},
      {value: 'program_number_request', label: 'CFDA Number Change', name: 'checkbox-al-number-request'}
    ],
    name: 'al-request-type-filter'
  };

  ngOnInit() {
    this.eventFilterModel= [this.defaultEventOption];
    this.domainFilterModel = [this.defaultDomainOption];
    if(this.defaultPendingRequestsOption) {
      this.pendingRequestsModel = ['pending-requests'];
    }
    this.domainFilterChange(this.domainFilterModel);
    this.eventFilterChange(this.eventFilterModel);
    this.pendingRequestsFilterChange(this.pendingRequestsModel);
    if(!(this.eventFilterModel.indexOf('request')< 0) || !(this.pendingRequestsModel.indexOf('pending-requests')< 0)){
      this.alRequestTypeModel = ['archive_request', 'unarchive_request', 'title_request', 'agency_request', 'program_number_request'];
      this.alRequestTypeFilterChange(this.alRequestTypeModel);
    }
  }

  eventFilterChange(event) {
    this.showALPendingRequestFilters = (event.indexOf('request') < 0)? false: true;
    this.showALRequestFilters = (event.indexOf('request') < 0)? false: true;
    this.eventFilterModelChange.emit(event);
  }

  pendingRequestsFilterChange(event){
    this.pendingRequestsFilterModelChange.emit(event);
  }

  domainFilterChange(event) {
    this.showALFilters = (event.indexOf('al') < 0)? false: true;
    this.domainFilterModelChange.emit(event);
  }

  alRequestTypeFilterChange(event) {
    this.alRequestTypeModelChange.emit(event);
  }
}
