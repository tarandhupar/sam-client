import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class WageDeterminationService{

  constructor(private oAPIService: WrapperService){}

  getWageDeterminationByReferenceNumberAndRevisionNumber(referenceNumber: string, revisionNumber: number) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/' + referenceNumber + '/' + revisionNumber,
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getWageDeterminationDictionary(ids: string) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/dictionaries',
      oParam: {
        ids: ids
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }
}
