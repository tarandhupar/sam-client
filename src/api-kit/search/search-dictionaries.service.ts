import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class SearchDictionariesService{

  constructor(private oAPIService: WrapperService){}

  dunsEntityAutoSearch(q: string) {
    let oApiParam = {
      name: 'searchDictionaries',
      suffix: '/entities',
      oParam: {
        'query': q + '*',
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  };
}
