import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';
import { Cookie } from "ng2-cookies";

@Injectable()
export class MsgFeedService{
  constructor(private oAPIService: WrapperService) { }

  getFilters(typeId:string){
    let oApiParam = {
      name: 'myFeeds',
      suffix: '/filter',
      oParam: {
        typeId:typeId,
      },
      method: 'GET'
    };

    return this.callApi(oApiParam);
  }

  getDomains(){
    if(Cookie.check('domains')){
      return Observable.of(JSON.parse(Cookie.get('domains')));
    }

    let apiOptions: any = {
      name: 'rms',
      method: 'GET',
      suffix: '/domains/',
    };

    return this.callApi(apiOptions).map(data => {
      let domainMap = {};
      data._embedded['domainList'].forEach( e => {
        if(e.isActive)domainMap[e.id] = e.domainName;
      });
      Cookie.set('domains',JSON.stringify(domainMap));
      return domainMap;
    });
  }

  getFeeds(typeId, filterObj, sortBy, pageNum, pageSize = 10){

    if(filterObj.section && filterObj.section.toLowerCase() === 'requests'){
      return this.getRequestsFeed(typeId, filterObj, sortBy, pageNum, pageSize);
    }else{
      return this.getNotificationFeeds(typeId, filterObj, sortBy, pageNum, pageSize);
    }
  }

  getRequestsFeed(typeId, filterObj, sortBy, pageNum, pageSize = 10){
    let oApiParam = {
      name: 'myFeeds',
      suffix: '/requests',
      oParam: {
        feedTypeId: typeId,
        sortBy: sortBy.type,
        order: sortBy.sort,
        limit: pageSize,
        pgNum: pageNum,
      },
      method: 'GET'
    };
    if(filterObj.requestType && filterObj.requestType.length > 0) oApiParam.oParam['reqIds'] = filterObj.requestType.join(',');
    if(filterObj.status && filterObj.status.length > 0) oApiParam.oParam['statIds'] = filterObj.status.join(',');
    if(filterObj.keyword !== "") oApiParam.oParam['q'] = filterObj.keyword;
    if(filterObj.orgs && filterObj.orgs.length > 0) {
      let orgs = [];
      filterObj.orgs.forEach(org => orgs.push(org.orgKey));
      oApiParam.oParam['orgIds'] = orgs.join(',');
    }

    return this.callApi(oApiParam);
  }

  getNotificationFeeds(typeId, filterObj, sortBy, pageNum, pageSize = 10){
    let oApiParam = {
      name: 'myFeeds',
      suffix: '/notifications',
      oParam: {
        feedTypeId: typeId,
        sortBy: sortBy.type,
        order: sortBy.sort,
        limit: pageSize,
        pgNum: pageNum,
      },
      method: 'GET'
    };
    if(filterObj.alertType && filterObj.alertType.length > 0) oApiParam.oParam['alertType'] = filterObj.alertType.join(',');
    if(filterObj.domains && filterObj.domains.length > 0) oApiParam.oParam['domainIds'] = filterObj.domains.join(',');
    if(filterObj.keyword !== "") oApiParam.oParam['q'] = filterObj.keyword;
    if(filterObj.alertStatus && filterObj.alertStatus.length === 1) oApiParam.oParam['alertStatus'] = filterObj.alertStatus[0];

    return this.callApi(oApiParam);

  }

  addAuthHeader(options) {
    let iPlanetCookie = Cookie.getAll().iPlanetDirectoryPro;

    if (!iPlanetCookie) {
      return;
    }

    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie;
  }

  callApi(oApiParam: any, convertToJSON: boolean = true) {
    this.addAuthHeader(oApiParam);
    return this.oAPIService
      .call(oApiParam, convertToJSON)
      .catch(res => {
        return Observable.throw(res);
      });
  }

}
