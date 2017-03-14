import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class AwardsService{

  constructor(private oAPIService: WrapperService){}
  
   getAwardsData(id: string) {
    let oApiParam = {
      name: 'awards',
      suffix: '/' + id,
	  method: 'GET',
    };
    return this.oAPIService.call(oApiParam);
  };
}
