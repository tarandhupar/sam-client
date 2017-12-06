import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class WageDeterminationService{

  constructor(private oAPIService: WrapperService){}

  getWageDeterminationByReferenceNumberAndRevisionNumber(referenceNumber: string, revisionNumber: number) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/wd/' + referenceNumber + '/' + revisionNumber,
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }


  getWageDeterminationFilterCountyData(obj){
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/dictionaries/wdCounties',
      oParam: {
        state: obj.state
      },
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getWageDeterminationHistoryByReferenceNumber(referenceNumber: string) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/wd/' + referenceNumber + '/history',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }

  getWageDeterminationToBeRevised(){
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/wd/toberevised',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(apiParam);
  }
}
