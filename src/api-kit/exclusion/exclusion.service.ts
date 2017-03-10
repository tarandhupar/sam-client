import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class ExclusionService{

  constructor(private oAPIService: WrapperService){}
  
  getExclusion(id: string) {
  	let encodedId = encodeURIComponent(id);
    let oApiParam = {
      name: 'exclusions',
      suffix: '/' + encodedId,
      oParam: {
        'sort': 'name'
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  };
}
