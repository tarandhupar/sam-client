import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class ContentManagementService{
  constructor(private oAPIService: WrapperService) { }

  typeMap = {
    'data-dictionary':1,
    'faq-repository':2,
    'video-library':3,
  };

  addAuthHeader(oApiParam) {
    let iPlanetCookie = Cookie.get('iPlanetDirectoryPro');

    if (!iPlanetCookie) {
      return;
    }
    oApiParam.headers = oApiParam.headers || {};
    oApiParam.headers['X-Auth-Token'] = iPlanetCookie;
  }

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
      name: 'cms',
      suffix: '/data',
      oParam: {
        type: this.typeMap[section.toLowerCase()],
        contentid: id,
      },
      method: 'GET'
    };
    this.addAuthHeader(oApiParam);
    return this.oAPIService.call(oApiParam);
  }

  getContent(filterObj, sortBy, pageNum, pageSize = 10){
    let oApiParam = {
      name: 'cms',
      suffix: '/data',
      oParam: {
        type: this.typeMap[filterObj.section.toLowerCase()],
        orderby: sortBy.type,
        order: sortBy.sort,
        limit: pageSize,
        offset: pageNum,
      },
      method: 'GET'
    };

    if(filterObj.domains.length > 0) oApiParam.oParam['domains'] = filterObj.domains.join(',');
    if(filterObj.keyword !== '') oApiParam.oParam['q'] = filterObj.keyword;
    if(filterObj.status.length > 0) oApiParam.oParam['statusid'] = filterObj.status.join(',');
    this.addAuthHeader(oApiParam);
    return this.oAPIService.call(oApiParam);
  }

  createContent(content){
    let oApiParam = {
      name: 'cms',
      suffix: '/data/create',
      oParam: {},
      body: content,
      method: 'POST'
    };
    this.addAuthHeader(oApiParam);
    return this.oAPIService.call(oApiParam);
  }

  updateContent(content){
    let oApiParam = {
      name: 'cms',
      suffix: '/data/update',
      oParam: {},
      body: content,
      method: 'PUT'
    };
    this.addAuthHeader(oApiParam);
    return this.oAPIService.call(oApiParam);
  }

  createTag(tagKey){
    let oApiParam = {
      name: 'cms',
      suffix: '/data/tags/create',
      oParam: {},
      body: {tagKey:tagKey},
      method: 'POST'
    };
    this.addAuthHeader(oApiParam);
    return this.oAPIService.call(oApiParam);
  }

  getTags(q){
    let oApiParam = {
      name: 'cms',
      suffix: '/data/tags',
      oParam: {},
      method: 'GET'
    };
    if(q !== '') oApiParam.oParam['q'] = q;
    this.addAuthHeader(oApiParam);
    return this.oAPIService.call(oApiParam);
  }

  getFAQContent(filterObj, sortBy, orderBy, pageNum, pageSize = 10){
    let oApiParam = {
      name: 'cms',
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

    this.addAuthHeader(oApiParam);
    return this.oAPIService.call(oApiParam);
  }

  checkAccess() {
    const params = {
      name: 'cms',
      suffix: '/data/checkaccess',
    };
    this.addAuthHeader(params);
    return this.oAPIService.call(params, false);
  }
}
