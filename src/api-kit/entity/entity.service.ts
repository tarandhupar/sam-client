import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class EntityService{

  constructor(private oAPIService: WrapperService){}
  
  getCoreDataById(id: string) {
    let oApiParam = {
      name: 'entities',
      suffix: '/' + id,
      oParam: {
        'sort': 'name'
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  };
}
