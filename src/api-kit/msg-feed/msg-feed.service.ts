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

  getFeeds(typeId, filterObj, sortBy, pageNum, pageSize = 10){

    if(filterObj.section.toLowerCase() === 'requests'){
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
    if(filterObj.requestType.length > 0) oApiParam.oParam['reqIds'] = filterObj.requestType.join(',');
    if(filterObj.status.length > 0) oApiParam.oParam['statIds'] = filterObj.status.join(',');
    if(filterObj.keyword !== "") oApiParam.oParam['q'] = filterObj.keyword;
    if(filterObj.orgs.length > 0) {
      let orgs = [];
      filterObj.orgs.forEach(org => orgs.push(org.orgKey));
      oApiParam.oParam['orgIds'] = orgs.join(',');
    }

    return this.callApi(oApiParam);
  }

  getNotificationFeeds(typeId, filterObj, sortBy, pageNum, pageSize = 10){
    // let oApiParam = {
    //   name: 'myFeeds',
    //   suffix: '/notifications',
    //   oParam: {
    //     feedTypeId: typeId,
    //     sortBy: sortBy.type,
    //     order: sortBy.sort,
    //     limit: pageSize,
    //     pgNum: pageNum,
    //   },
    //   method: 'GET'
    // };
    // if(filterObj.alertType.length > 0) oApiParam.oParam['alertType'] = filterObj.alertType.join(',');
    // if(filterObj.domains.length > 0) oApiParam.oParam['domainIds'] = filterObj.domains.join(',');
    // if(filterObj.keyword !== "") oApiParam.oParam['q'] = filterObj.keyword;
    //
    // return this.callApi(oApiParam);
    return Observable.of({"notificationCount":21,"notificationFeeds":[
      {"feedMessageId":16,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2016-01-14T19:00:00.000-0500","responderDate":null,"feeds":"<span>You are now subscribed to updates in <b>FEDERAL HIERARCHY</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.178-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.178-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=16"}}},{"feedMessageId":17,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2016-01-25T19:00:00.000-0500","responderDate":"2016-06-17T20:00:00.000-0400","feeds":"<span>A new Agency <b>XXYY</b> was created under <b>ABC</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.179-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.179-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=17"}}},{"feedMessageId":19,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":11,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2016-02-09T19:00:00.000-0500","responderDate":null,"feeds":"<span>You are now subscribed to updates in <b>REPORTING</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.181-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.181-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=19"}}},{"feedMessageId":20,"feedtypeId":4,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2016-04-17T20:00:00.000-0400","responderDate":"2016-12-25T19:00:00.000-0500","feeds":"<span>Office <b>XCX</b> was moved under <b>NAZ</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.203-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.203-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=20"}}},{"feedMessageId":18,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2016-06-07T20:00:00.000-0400","responderDate":"2016-12-25T19:00:00.000-0500","feeds":"<span>A new Agency <b>XCX</b> was created under <b>XXYY</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.180-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.180-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=18"}}},{"feedMessageId":21,"feedtypeId":4,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2016-09-17T20:00:00.000-0400","responderDate":"2019-03-25T20:00:00.000-0400","feeds":"<span>Office <b>UUU</b> has a end date set on 26,Mar 2019</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.204-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.204-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=21"}}},{"feedMessageId":15,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":10,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2016-12-14T19:00:00.000-0500","responderDate":null,"feeds":"<span>You are now subscribed to updates in <b>ADMIN</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.177-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.177-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=15"}}},{"feedMessageId":8,"feedtypeId":5,"requestTypeId":null,"requestStatusId":null,"domainId":null,"alertTypeName":"Warning","orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2017-01-09T19:00:00.000-0500","responderDate":"2018-03-15T20:00:00.000-0400","feeds":"<span>Alert Title 8</span>\n    <span>Alert Description Warning</span>","link":"/alerts","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.146-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.146-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=8"}}},{"feedMessageId":2,"feedtypeId":5,"requestTypeId":null,"requestStatusId":null,"domainId":null,"alertTypeName":"Warning","orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2017-01-14T19:00:00.000-0500","responderDate":"2017-02-27T19:00:00.000-0500","feeds":" <span>Alert Title 2</span>\n    <span>Alert Description Warning</span>","link":"/alerts","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.140-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.140-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=2"}}},{"feedMessageId":6,"feedtypeId":5,"requestTypeId":null,"requestStatusId":null,"domainId":null,"alertTypeName":"Informational","orgId":null,"level":null,"requestorId":null,"responderId":null,"requestorDate":"2017-04-18T20:00:00.000-0400","responderDate":"2018-05-20T20:00:00.000-0400","feeds":"  <span>Alert Title 6</span>\n    <span>Alert Description Informational</span>","link":"/alerts","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.144-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.144-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=6"}}}],"_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/notifications?feedTypeId=3,4,5&limit=10&pgNum=1&sortBy=reqDate&order=asc"}}});

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
