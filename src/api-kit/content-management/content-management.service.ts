import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContentManagementService{
  constructor(private oAPIService: WrapperService) { }

  typeMap = {
    'data-definition':1,
    'faq-repository':2,
    'video-library':3,
  };

  getDomains(){
    return Observable.of({
      'domainTypes':[
        {domainName: 'Assistance Listings'},
        {domainName: 'Contract Opportunities'},
        {domainName: 'Entity Information'},
        {domainName: 'Sub-Awards'},
        {domainName: 'Wage Determinationss'}
      ]
    });
  }

  getContentItem(id, ){
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data',
      oParam: {
        contentid: id,
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getContent(filterObj, sortBy, pageNum, pageSize = 10){
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data',
      oParam: {
        type: this.typeMap[filterObj.section.toLowerCase()],
        // sortBy: sortBy.type,
        // order: sortBy.sort,
        limit: pageSize,
        offset: pageNum,
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  getFAQContent(filterObj, sortBy, orderBy, pageNum, pageSize = 10){
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data',
      oParam: {
        feedTypeId: '2',
        // sortBy: sortBy.type,
        // order: sortBy.sort,
        limit: pageSize,
        offset: pageNum,
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

}
