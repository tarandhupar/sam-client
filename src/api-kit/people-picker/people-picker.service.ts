import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { WrapperService } from '../wrapper/wrapper.service';
import { forEach } from 'lodash';
import 'rxjs/add/operator/map';


@Injectable()
export class PeoplePickerService {
  constructor(private oAPIService: WrapperService) {}

  getList(obj) {
    let keys = ('orderBy|dir|page').split('|'),
        oApiParam = {
          name: 'userPicker',
          suffix: '/',
          oParam: {
            q: obj.keyword,
            qFilters: {}
          },
          method: 'GET'
        };

    forEach(keys, (key) => {
      if(typeof obj[key] !== 'undefined' && obj[key] !== null && obj[key] !== '') {
        oApiParam.oParam[key] = obj[key];
      }
    });

    return this.oAPIService.call(oApiParam);
  }

  getPerson(email, obj) {
    let oApiParam = {
      name: 'userPicker',
      suffix: '/'+email,
      oParam: {},
      method: 'GET'
    };

    if(typeof obj.orderBy !== 'undefined' && obj.orderBy !== null && obj.orderBy !== '')
      oApiParam.oParam['orderBy'] = obj.orderBy;
    if(typeof obj.dir !== 'undefined' && obj.dir !== null && obj.dir !== '')
      oApiParam.oParam['dir'] = obj.dir;

    return this.oAPIService.call(oApiParam);
  }

  getFilteredList(obj) {
    let keys = ('firstName|lastName|email|fle|organization|orderBy|dir|page').split('|'),
        oApiParam = {
          name: 'userPicker',
          suffix: '/filter',
          oParam: {},
          method: 'GET'
        };

    forEach(keys, (key) => {
      if(typeof obj[key] !== 'undefined' && obj[key] !== null && obj[key] !== '') {
        oApiParam.oParam[key] = obj[key];
      }
    });

    return this.oAPIService.call(oApiParam);
  }
}
