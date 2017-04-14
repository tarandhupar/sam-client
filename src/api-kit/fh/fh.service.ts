import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class FHService {

  constructor(private oAPIService: WrapperService) { }

  //gets organization with heirarchy data
  getOrganizationById(id: string, includeChildrenLevels: boolean, includeOrgTypes: boolean = false) {
    var oApiParam = {
        name: '',
        suffix: '',
        oParam: {},
        method: 'GET'
      };

    //organizationId length >= 30 -> call opportunity org End Point
    if (id.length >= 30) {
      oApiParam.name = 'opportunity';
      oApiParam.suffix = '/opportunities/' + id + '/organization';
    } else { //organizationId less than 30 character then call Octo's FH End point
      oApiParam.name = 'federalHierarchy';
      oApiParam.suffix = ((includeChildrenLevels) ? '/hierarchy/' : '/') + id;
      oApiParam.oParam = {
        'sort': 'name'
      };
    }

    if (includeOrgTypes) {
      oApiParam.oParam['types'] = 'true';
    }

    return this.oAPIService.call(oApiParam);
  }

  getOrganizationLogo(organizationAPI: Observable<any>, cbSuccessFn: any, cbErrorFn: any) {
    organizationAPI.subscribe(org => {
      // Do some basic null checks
      if(org == null || org['_embedded'] == null || org['_embedded'][0] == null) {
        cbSuccessFn(null);
        return;
      }

      //base when no logo for a department
      if(typeof org['_embedded'][0]['_link']['logo'] == 'undefined' && org['_embedded'][0]['org'] != null && typeof org['_embedded'][0]['org']['parentOrgKey'] == 'undefined') {
        cbSuccessFn(null);
        return;
      }

      // Base case: If logo exists, save it to a variable and exit
      if(org['_embedded'][0]['_link'] != null && org['_embedded'][0]['_link']['logo'] != null && org['_embedded'][0]['_link']['logo']['href'] != null) {
        let response = {};
        let data = org['_embedded'][0]['org'];
        response['logo'] = org['_embedded'][0]['_link']['logo']['href'];
        response['info'] = (data['agencyName'] || data['name'] || data['orgKey'] || 'Organization') + ' Logo';

        cbSuccessFn(response);
        return;
      }

      // Recursive case: If parent orgranization exists, recursively try to load its logo
      if(org['_embedded'][0]['org'] != null && org['_embedded'][0]['org']['parentOrgKey'] != null) {
        this.getOrganizationLogo(this.getOrganizationById(org['_embedded'][0]['org']['parentOrgKey'], false), cbSuccessFn, cbErrorFn);
      }
    }, err => {
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

  updateOrganization(org) {
    let apiOptions: any = {
      name: 'federalHierarchy',
      suffix: '/cfda/' + org.orgKey,
      method: 'PUT',
      body: org
    };
    return this.oAPIService.call(apiOptions);
  }

  createOrganization(org) {
    let apiOptions: any = {
      name: 'federalCreateOrg',
      suffix: '',
      method: 'POST',
      body: org
    };

    return this.oAPIService.call(apiOptions);
  }

}
