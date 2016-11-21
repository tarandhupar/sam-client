import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class FHService{

  constructor(private oAPIService: WrapperService){}

  getFederalHierarchyById(id: string, includeParentLevels: boolean, includeChildrenLevels: boolean) {
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '/'+id,
      oParam: {
        'sort': 'name'
      },
      method: 'GET'
    };
    if (includeParentLevels) {
      oApiParam.oParam['parentLevels'] = 'all';
    }

    if (includeChildrenLevels) {
      oApiParam.oParam['childrenLevels'] = 'all';
    }
    return this.oAPIService.call(oApiParam);
  }

  getOrganizationById(id: string) {
    let oApiParam = {
      name: 'federalHierarchyV2',
      suffix: '/'+id,
      oParam: {
        'sort': 'name'
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  }

  getFederalHierarchyByIds(aIDs, includeParentLevels: boolean, includeChildrenLevels: boolean) {
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '/',
      oParam: {
        'sort': 'name',
        'ids': aIDs.join(',')
      },
      oData: {},
      method: 'GET'
    };

    if (includeParentLevels) {
      oApiParam.oParam['parentLevels'] = 'all';
    }

    if (includeChildrenLevels) {
      oApiParam.oParam['childrenLevels'] = 'all';
    }

    //make api call to get federalHierarchy by id
    return this.oAPIService.call(oApiParam);
  };

  getFullLabelPathFederalHierarchyById (id: string, includeParentLevels: boolean, includeChildrenLevels: boolean, successCallback, errorCallback) {
    this.getFederalHierarchyById(id, includeParentLevels, includeChildrenLevels).subscribe(res=>{
      successCallback(this.getFullNameFederalHierarchy(res));
    }, err =>{
      errorCallback(err);
    });
  };

  getFullNameFederalHierarchy (oData) {
    var name = oData.name;

    if (oData.hasOwnProperty('hierarchy')) {
        name += ' / ' + this.getFullNameFederalHierarchy(oData['hierarchy'][0]);
    }

    return name;
  };

  search(oData){
    let oApiParam = {
      name: 'federalHierarchy',
      suffix: '/',
      oParam: {
      },
      method: 'GET'
    };
    if (oData['ids']) {
      oApiParam.oParam['ids'] = oData['ids'];
    }
    if (oData['name']) {
      oApiParam.oParam['name'] = oData['name'];
    }
    if (oData['limit']) {
      oApiParam.oParam['limit'] = oData['limit'];
    }
    return this.oAPIService.call(oApiParam);
  }

  //TODO: remove this function and replace it with getOrganizationById once SAM-492 is merged to comp
  getFederalHierarchyV2ById(id: string) {
    let apiParam = {
      name: 'federalHierarchyV3',
      suffix: '/'+id,
      oParam: {
        'sort': 'name'
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }
}
