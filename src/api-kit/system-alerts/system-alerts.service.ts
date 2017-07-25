import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { Cookie } from "ng2-cookies";

export type AlertType = {
  content: {
    title?: string,
    begins?: string,
    expires?: string,
    category?: string,
    severity?: string,
    published?: string,
    description?: string,
    isExpiresIndefinite?: string,
  },
  status?: string,
  alertId?: number,
  rank?: any,
  createdDate?: string,
  createdBy?: any,
  lastModifiedBy?: string,
  lastModifiedDate?: string,
}

@Injectable()
export class SystemAlertsService {
  constructor(private apiService: WrapperService) {}

  getActive(limit?: number, offset?: number) {

    let apiOptions: any = {
      name: 'alerts',
      suffix: '',
      method: 'GET',
      oParam: { }
    };

    // specify defaults
    apiOptions.oParam.limit = limit || 5;
    apiOptions.oParam.offset = offset || 0;
    
    this.addAuthHeader(apiOptions);
    return this.apiService.call(apiOptions);
     
  }
  
  /**
   *
   * @param limit: the number of alerts to fetch
   * @param offset: for paging, the first page
   * @param archived: array of statuses to include in the results. Status is Y for active and N for inactive.
   * @param severity: array of types to include in results. warning|error|informational
   * @param published: the number of days in the past to include in the result. Valid values: 30d|90d|6m|1y
   * @param sort: the sort column. offset|severity|published...
   * @param order: asc or desc
   * @returns {Observable<>}
   */
  getAll(limit?: number, offset?: number, status?: [string], severity?: [string], published?: string, sort?: string, order?: string) {

    let apiOptions: any = {
      name: 'allAlerts',
      suffix: '',
      method: 'GET',
      oParam: { }
    };

    // specify defaults
    apiOptions.oParam.limit = limit || 5;
    apiOptions.oParam.offset = offset || 0;

    if (status && status.length) {
      apiOptions.oParam.status = status.join(',');
    }

    if (severity && severity.length) {
      apiOptions.oParam.severity = severity.join(',');
    }

    if (published) {
      apiOptions.oParam.published = published;
    }

    if (sort) {
      apiOptions.oParam.sort = sort;
    }

    if (order) {
      apiOptions.oParam.order = order;
    }

    this.addAuthHeader(apiOptions);    

    return this.apiService.call(apiOptions);
  }

  updateAlert(alert: AlertType) {
    const apiOptions: any = {
      name: 'alerts',
      suffix: '/' + alert.alertId,
      method: 'PUT',
      body: alert
    };

    this.addAuthHeader(apiOptions);
    return this.apiService.call(apiOptions);
  }

  createAlert(alert: AlertType) {
    const apiOptions: any = {
      name: 'alerts',
      suffix: '',
      method: 'POST',
      body: alert
    };

    this.addAuthHeader(apiOptions);
    return this.apiService.call(apiOptions);
  }

  deleteAlert(id: number) {
    const apiOptions: any = {
      name: 'alerts',
      suffix: '',
      method: 'DELETE',
      body: {
        alertId: id
      }
    };

    return this.apiService.call(apiOptions);
  }

  addAuthHeader(options) {
    let iPlanetCookie = Cookie.getAll().iPlanetDirectoryPro;

    if (!iPlanetCookie) {
      return;
    }

    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie;
  }

}
