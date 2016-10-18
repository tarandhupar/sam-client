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
}
