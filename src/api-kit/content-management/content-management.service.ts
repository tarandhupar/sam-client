import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContentManagementService{
  constructor(private oAPIService: WrapperService) { }

  typeMap = {
    'data-dictionary':1,
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

  getContentItem(id, section){
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data',
      oParam: {
        type: this.typeMap[section.toLowerCase()],
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
        orderBy: sortBy.type,
        order: sortBy.sort,
        limit: pageSize,
        offset: pageNum,
      },
      method: 'GET'
    };

    if(filterObj.domains.length > 0) oApiParam.oParam['domains'] = filterObj.domains.join(',');
    if(filterObj.keyword !== '') oApiParam.oParam['q'] = filterObj.keyword;
    if(filterObj.status.length > 0) oApiParam.oParam['statusid'] = filterObj.status.join(',');

    return this.oAPIService.call(oApiParam);
  }

  createContent(content){
    if(content['type'].typeId == null) content['type'] = {'typeId':this.typeMap[content['type']]};
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data/create',
      oParam: {},
      body: content,
      method: 'POST'
    };

    return this.oAPIService.call(oApiParam);
  }

  updateContent(content){
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data/update',
      oParam: {},
      body: content,
      method: 'PUT'
    };

    return this.oAPIService.call(oApiParam);
  }

  createTag(tagKey){
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data/tags/create',
      oParam: {},
      body: {tagKey:tagKey},
      method: 'POST'
    };

    return this.oAPIService.call(oApiParam);
  }

  getTags(q){
    let oApiParam = {
      name: 'helpContent',
      suffix: '/data/tags',
      oParam: {},
      method: 'GET'
    };
    if(q !== '') oApiParam.oParam['q'] = q;
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
