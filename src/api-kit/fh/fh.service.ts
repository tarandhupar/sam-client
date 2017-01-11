import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class FHService {

  constructor(private oAPIService: WrapperService) { }

  //gets organization with heirarchy data
  getOrganizationById(id: string, includeChildrenLevels: boolean) {
    var oApiParam = {
        name: '',
        suffix: '',
        oParam: {},
        method: 'GET'
      };

    //organizationId length >= 30 -> call opportunity org End Point
    if (id.length >= 30) {
      oApiParam.name = 'opportunity';
      oApiParam.suffix = '/' + id + '/organization';
    } else { //organizationId less than 30 character then call Octo's FH End point
      oApiParam.name = 'federalHierarchy';
      oApiParam.suffix = ((includeChildrenLevels) ? '/hierarchy/' : '/') + id;
      oApiParam.oParam = {
        'sort': 'name'
      };
    }

    return this.oAPIService.call(oApiParam);
  }

  getOrganizationLogo(organizationAPI: Observable<any>, cbSuccessFn: any, cbErrorFn: any) {
    organizationAPI.subscribe(org => {
      if(org == null || org['_embedded'] == null || org['_embedded'][0] == null) {
        cbSuccessFn(null);
        return;
      }

      if(org['_embedded'][0]['_link'] != null && org['_embedded'][0]['_link']['logo'] != null && org['_embedded'][0]['_link']['logo']['href'] != null) {
        cbSuccessFn(org['_embedded'][0]['_link']['logo']['href']);
        return;
      }

      if(org['_embedded'][0]['org'] != null && org['_embedded'][0]['org']['parentOrgKey'] != null) {
        this.getOrganizationLogo(this.getOrganizationById(org['_embedded'][0]['org']['parentOrgKey'], false), cbSuccessFn, cbErrorFn);
      }
    }, err => {
      console.log('Error loading logo: ', err);
      cbErrorFn(err);
    });
  }

  getDepartments() {
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '/departments/',
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  }

  search(oData) {
    let oApiParam = {
      name: 'search',
      suffix: '/',
      oParam: {
        index: "fh",
        q: oData.keyword
      },
      method: 'GET'
    };
    if (oData['pageNum']) {
      oApiParam.oParam['page'] = oData['pageNum'];
    }
    if (oData['pageSize']) {
      oApiParam.oParam['size'] = oData['pageSize'];
    }
    if (oData['parentOrganizationId']) {
      oApiParam.oParam['qFilters'] = {
        parentOrganizationId: oData['parentOrganizationId']
      };
    }
    return this.oAPIService.call(oApiParam);
  }

}
