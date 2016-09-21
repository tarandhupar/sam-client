import {Injectable} from '@angular/core';
import {APIService} from '../../common/service/api.service'
import 'rxjs/add/operator/map';

@Injectable()
export class FHService{

  constructor(private oAPIService: APIService){
    console.log('FH Service Started... ');
  }

  getFederalHierarchyById(id: string) {
      let oApiParam = {
        name: 'federalHierarchy',
        suffix: '/'+id,
        oParam: {},
        method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }
}
