import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import 'rxjs/add/operator/map';

@Injectable()
export class ReportsService {

  constructor(private oAPIService: WrapperService) {}

  getPreferenceByType(type: string, cookie: string) {
    let apiParam = {
      name: 'preferences',
      suffix: '/' + type,
      oParam: {},
      headers: {
        'iPlanetDirectoryPro': cookie
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  savePreference(type: String = null, data: any, cookie: string) {
    let oApiParam = {
      name: 'preferences',
      suffix: (type === null) ? '/new' : '/' + type + '/edit',
      oParam: {},
      headers: {
        'iPlanetDirectoryPro': cookie
      },
      body: data,
      method: (type === null) ? 'POST' : 'PUT'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  deletePreference(type: String, cookie: string) {
    let oApiParam = {
      name: 'preferences',
      suffix: '/' + type + '/delete',
      oParam: {},
      headers: {
        'iPlanetDirectoryPro': cookie
      },
      body: {},
      method: 'DELETE'
    };

    return this.oAPIService.call(oApiParam, false);
  }

  getUserRole(cookie: String) {
    let oApiParam = {
      name: 'iam',
      suffix: '/roles',
      oParam: {
        'fetchNames': true
      },
      headers: {
        'iPlanetDirectoryPro': cookie
      },
      body: {},
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  }
}
