import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';


@Injectable()
export class SystemAlertsService {
    constructor(private oAPIService: WrapperService) {}

    get(count?: number) {

      let oApiParam = {
        name: 'alerts',
        suffix: '',
        method: 'GET',
        oParam: { limit: null }
      };

      // fetch 5 alerts, if the count is not specified
      oApiParam.oParam.limit = count || 5;
      return this.oAPIService.call(oApiParam);
    }
}
