import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WrapperService } from '../wrapper/wrapper.service';


@Injectable()
export class SystemAlertsService {
    constructor(private oAPIService: WrapperService) {}

    getAll() {

      let oApiParam = {
        name: 'alerts',
        suffix: '',
        oParam: {
          limit: 5
        },
        method: 'GET'
      };

      return this.oAPIService.call(oApiParam);
    }
}
