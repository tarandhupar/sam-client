import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';

@Injectable()
export class AwardsService{

  constructor(private oAPIService: WrapperService){}
  
  getAwardsData(agencyCode: string, piid: string, modificationNumber: string, transactionNumber: string, aiType: string) {
    let oApiParam = {
      name: 'awards',
      suffix: '/',
	  method: 'POST',
	  body:
	  {
		"agencyCode" : agencyCode,
		"piid" : piid,
		"modificationNumber" : modificationNumber,
		"transactionNumber" : transactionNumber,
		"aiType" : aiType
	  }
    };
    return this.oAPIService.call(oApiParam);
  };
  
   getIDVData(agencyCode: string, piid: string, modificationNumber: string, aiType: string) {
    let oApiParam = {
      name: 'awards',
      suffix: '/',
	  method: 'POST',
	  body:
	  {
		"agencyCode" : agencyCode,
		"piid" : piid,
		"modificationNumber" : modificationNumber,
		"aiType" : aiType
	  }
    };
    return this.oAPIService.call(oApiParam);
  };
  
   getOTAData(agencyCode: string, piid: string, modificationNumber: string, transactionNumber: string, aiType: string) {
    let oApiParam = {
      name: 'awards',
      suffix: '/',
	  method: 'POST',
	  body:
	  {
		"agencyCode" : agencyCode,
		"piid" : piid,
		"modificationNumber" : modificationNumber,
		"transactionNumber" : transactionNumber,
		"aiType" : aiType
	  }
    };
    return this.oAPIService.call(oApiParam);
  };
  
  getOTIData(agencyCode: string, piid: string, modificationNumber: string, aiType: string) {
    let oApiParam = {
      name: 'awards',
      suffix: '/',
	  method: 'POST',
	  body:
	  {
		"agencyCode" : agencyCode,
		"piid" : piid,
		"modificationNumber" : modificationNumber,
		"aiType" : aiType
	  }
    };
    return this.oAPIService.call(oApiParam);
  };
}
