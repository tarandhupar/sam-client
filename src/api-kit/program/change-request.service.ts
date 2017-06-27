import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class ChangeRequestService {

  constructor(private oAPIService: WrapperService) { }

  submitRequest(data: any, cookie: string): Observable<any> {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequests',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: 'POST'
    };

    return this.oAPIService.call(oApiParam);
  }

  submitRequestAction(data: any, cookie: string): Observable<any> {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequestActions',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: data,
      method: 'POST'
    };

    return this.oAPIService.call(oApiParam);
  }

  getRequest(id: string, cookie: string): Observable<any> {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequests/' + id,
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getRequestActionByRequestId(requestId: string, cookie: string): Observable<any> {
    let oApiParam = {
      name: 'program',
      suffix: '/programRequests/' + requestId + '/action',
      oParam: {},
      headers: {
        "X-Auth-Token": cookie
      },
      body: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}