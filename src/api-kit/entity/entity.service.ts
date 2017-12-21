import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service'
import { isArray } from 'lodash';

@Injectable()
export class EntityService {
  constructor(private oAPIService: WrapperService) {}

  getCoreDataById(id: string) {
    let oApiParam = {
      method: 'GET',
      name: 'entities',
      suffix: '/' + id,
      oParam: {
        'sort': 'name'
      },
    };

    return this.oAPIService.call(oApiParam);
  }

  findByCageCode(cageCode: string) {
    let options = {
      name: 'rms',
      suffix: `/autocomplete/entity/${cageCode}`,
      method: 'GET',
      oParam: {}
    };

    return this.oAPIService
      .call(options)
      .map(data => {
        data = data || [];

        // Any successful call that returns anything but the intended format will get defaulted.
        // If this is a problem, API's error response handling will need to be looked at again
        // (The previous set only covers scenarios where data is undefined or null, this conditional is needed)
        if(isArray(data)) {
          data = data.length ? data[0] : {
            duns: null,
            cageCode: cageCode,
            legalBusinessName: null,
            address: null
          };
        }

        return data;
      });
  }
}
