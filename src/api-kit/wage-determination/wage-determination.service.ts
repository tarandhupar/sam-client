import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import * as Cookies from 'js-cookie';

@Injectable()
export class WageDeterminationService {
  authCookie: any;

  constructor(private oAPIService: WrapperService) {
    this.authCookie = Cookies.get('iPlanetDirectoryPro');
  }

  getCBAPermissions(permissions?: any, orgId: string = null) {
    let paramObj = {};

    if(permissions) {
      paramObj['permissions'] = permissions;
    } else {
      paramObj['size'] = 0;
    }

    let oApiParam = {
      name: 'wageDetermination',
      suffix: permissions ? '/cba/permissions' : '/cba',
      oParam: paramObj,
      headers: {
        "X-Auth-Token": this.authCookie
      },
      method: 'GET'
    };

    if(orgId != null) {
      oApiParam.oParam['organizationId'] = orgId;
    }

    return this.oAPIService.call(oApiParam);
  }

  reviseCollectiveBargaining(cbaNum: string) {
    let oApiParam = {
      name: 'wageDetermination',
      suffix: '/cba/' + cbaNum + '/revise',
      oParam: {},
      headers: {},
      method: 'POST'
    };

    oApiParam.headers = {
      "X-Auth-Token": this.authCookie
    };

    return this.oAPIService.call(oApiParam, false);
  }

  saveCollectiveBargaining(id: number = null, data: any) {
    let oApiParam = {
      name: 'wageDetermination',
      suffix: id ? '/cba/' + id : '/cba',
      oParam: {},
      headers: {},
      body: data,
      method: id ? 'PUT' : 'POST'
    };

    oApiParam.headers = {
      "X-Auth-Token": this.authCookie
    };

    return this.oAPIService.call(oApiParam, false);
  }

  getWageDeterminationById(id: string) {
    let oApiParam = {
      name: 'wageDetermination',
      suffix: (id == null) ? '/cba' : '/cba/' + id,
      oParam: {},
      headers: {},
      method: 'GET'
    };

    oApiParam.headers = {
      "X-Auth-Token": this.authCookie
    };

    return this.oAPIService.call(oApiParam);
  }

  getWageDeterminationByReferenceNumberAndRevisionNumber(referenceNumber: string, revisionNumber: number) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/wd/' + referenceNumber + '/' + revisionNumber,
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }


  getWageDeterminationFilterCountyData(obj) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/dictionaries/wdCounties',
      oParam: {
        state: obj.state
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getWageDeterminationHistoryByReferenceNumber(referenceNumber: string) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/wd/' + referenceNumber + '/history',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getCBAByReferenceNumber(referenceNumber: string){
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/cba/' + referenceNumber,
      oParam: {},
      method: 'GET'
    };
    return this.oAPIService.call(apiParam);
  }

  getWageDeterminationToBeRevised(){
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/wd/toberevised',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }
}
