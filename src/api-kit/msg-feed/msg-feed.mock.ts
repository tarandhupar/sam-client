import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class MsgFeedServiceMock{
  constructor(private oAPIService: WrapperService) { }

  getAlertType(){
    return Observable.of({alertType:['Informational','Warning','Critical']})
  }

  getRequestsType(){
    return Observable.of({
      'RequestsType': ['Role', 'Title Change', 'Number Change'],
      'totalCount': {sentCount:6, receivedCount:4},
      'Role':{sentCount:2, receivedCount:1},
      'Title Change':{sentCount:1, receivedCount:2},
      'Number Change':{sentCount:3, receivedCount:1},
    });
  }

  getDomains(){
    return Observable.of({
      'Domains':['Assistance Listings', 'Contract Opportunities', 'Contract Awards', 'Entity Information', 'Sub-Awards', 'Wage Determinations']
    });
  }

  getFeeds(typeId, filterObj, sortBy, pageNum, pageSize = 20){
    if(filterObj.section.toLowerCase() === 'requests'){
      return this.getRequestsFeed(typeId, filterObj, sortBy, pageNum, pageSize);
    }else{
      return this.getNotificationFeeds(typeId, filterObj, sortBy, pageNum, pageSize);
    }
  }

  getRequestsFeed(typeId, filterObj, sortBy, pageNum, pageSize = 20){
    if(filterObj.subSection === ''){
      return Observable.of({"totalRecords":18,"requestFeeds":[{"feedMessageId":29,"feedtypeId":1,"requestTypeId":2,"requestStatusId":null,"domainId":null,"alertTypeName":null,"orgId":100005143,"level":null,"requestorId":100,"responderId":11,"resquestorDate":"2016-01-24T19:00:00.000-0500","responderDate":"2017-09-26T17:00:00.000-0500","feeds":"<span>FH Role Request recieved by YY with org id 100005143</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.257-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.257-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=29"}}},{"feedMessageId":34,"feedtypeId":2,"requestTypeId":1,"requestStatusId":1,"domainId":null,"alertTypeName":null,"orgId":100006688,"level":null,"requestorId":121,"responderId":null,"resquestorDate":"2016-09-17T20:00:00.000-0400","responderDate":null,"feeds":"<span class=\"usa-width-one-whole msg-feed-description\">Admin Role Request submitted by XXX with org id 100006688</span>","createdBy":"Admin","createdDate":"2017-09-13T17:31:14.960-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-13T17:31:14.960-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=34"}}},{"feedMessageId":22,"feedtypeId":1,"requestTypeId":1,"requestStatusId":null,"domainId":null,"alertTypeName":null,"orgId":100006688,"level":null,"requestorId":121,"responderId":null,"resquestorDate":"2016-09-17T20:00:00.000-0400","responderDate":null,"feeds":"<span class=\"usa-width-one-whole msg-feed-description\">Admin Role Request submitted by XXX with org id 100006688</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.229-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.229-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=22"}}},{"feedMessageId":28,"feedtypeId":1,"requestTypeId":2,"requestStatusId":null,"domainId":null,"alertTypeName":null,"orgId":100006688,"level":null,"requestorId":121,"responderId":12,"resquestorDate":"2016-09-17T20:00:00.000-0400","responderDate":"2016-09-19T20:00:00.000-0400","feeds":"<span>Admin Role Request recieved by XXX with org id 100006688</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.256-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.256-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=28"}}},{"feedMessageId":35,"feedtypeId":2,"requestTypeId":1,"requestStatusId":1,"domainId":null,"alertTypeName":null,"orgId":100005143,"level":null,"requestorId":100,"responderId":null,"resquestorDate":"2016-12-24T19:00:00.000-0500","responderDate":null,"feeds":"<span>FH Role Request submitted by YY with org id 100005143</span>","createdBy":"Admin","createdDate":"2017-09-13T17:31:14.960-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-13T17:31:14.960-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=35"}}},{"feedMessageId":23,"feedtypeId":1,"requestTypeId":1,"requestStatusId":null,"domainId":null,"alertTypeName":null,"orgId":100005143,"level":null,"requestorId":100,"responderId":null,"resquestorDate":"2016-12-24T19:00:00.000-0500","responderDate":null,"feeds":"<span>FH Role Request submitted by YY with org id 100005143</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.230-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.230-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=23"}}},{"feedMessageId":26,"feedtypeId":1,"requestTypeId":3,"requestStatusId":null,"domainId":null,"alertTypeName":null,"orgId":null,"level":null,"requestorId":105,"responderId":null,"resquestorDate":"2017-01-18T19:00:00.000-0500","responderDate":null,"feeds":"<span class=\"usa-width-one-whole msg-feed-description\">Number Change Requested</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.233-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.233-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=26"}}},{"feedMessageId":30,"feedtypeId":1,"requestTypeId":2,"requestStatusId":null,"domainId":null,"alertTypeName":null,"orgId":null,"level":null,"requestorId":105,"responderId":9,"resquestorDate":"2017-01-18T19:00:00.000-0500","responderDate":"2016-02-18T19:00:00.000-0500","feeds":"<span>Title Change Received</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.259-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.259-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=30"}}},{"feedMessageId":36,"feedtypeId":2,"requestTypeId":2,"requestStatusId":2,"domainId":null,"alertTypeName":null,"orgId":null,"level":null,"requestorId":105,"responderId":null,"resquestorDate":"2017-01-18T19:00:00.000-0500","responderDate":null,"feeds":"<span>Title Change Requested</span>","createdBy":"Admin","createdDate":"2017-09-13T17:31:14.961-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-13T17:31:14.961-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=36"}}},{"feedMessageId":38,"feedtypeId":2,"requestTypeId":3,"requestStatusId":3,"domainId":null,"alertTypeName":null,"orgId":null,"level":null,"requestorId":105,"responderId":null,"resquestorDate":"2017-01-18T19:00:00.000-0500","responderDate":null,"feeds":"<span>Number Change Requested</span>","createdBy":"Admin","createdDate":"2017-09-13T17:31:14.963-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-13T17:31:14.963-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=38"}}}],"recievedCount":6,"roleCount":2,"numberChangeCount":2,"titleChangeCount":2,"_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/requests?feedTypeId=1,2&limit=10&pgNum=1&sortBy=reqDate&order=asc"}}});
    } else if(filterObj.subSection.toLowerCase() === 'received'){
      return Observable.of({
        feeds:[
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Rejected', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
        ],
        totalCount: 6,
      });
    } else if(filterObj.subSection.toLowerCase() === 'sent'){
      return Observable.of({
        feeds:[
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Rejected', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
        ],
        totalCount: 4,
      });
    }

  }

  getNotificationFeeds(typeId, filterObj, sortBy, pageNum, pageSize = 20){
    if(filterObj.subSection === '') {
      return Observable.of({"notificationCount":21,"notificationFeeds":[{"feedMessageId":16,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2016-01-14T19:00:00.000-0500","responderDate":null,"feeds":"<span>You are now subscribed to updates in <b>FEDERAL HIERARCHY</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.178-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.178-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=16"}}},{"feedMessageId":17,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2016-01-25T19:00:00.000-0500","responderDate":"2016-06-17T20:00:00.000-0400","feeds":"<span>A new Agency <b>XXYY</b> was created under <b>ABC</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.179-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.179-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=17"}}},{"feedMessageId":19,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":11,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2016-02-09T19:00:00.000-0500","responderDate":null,"feeds":"<span>You are now subscribed to updates in <b>REPORTING</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.181-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.181-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=19"}}},{"feedMessageId":20,"feedtypeId":4,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2016-04-17T20:00:00.000-0400","responderDate":"2016-12-25T19:00:00.000-0500","feeds":"<span>Office <b>XCX</b> was moved under <b>NAZ</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.203-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.203-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=20"}}},{"feedMessageId":18,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2016-06-07T20:00:00.000-0400","responderDate":"2016-12-25T19:00:00.000-0500","feeds":"<span>A new Agency <b>XCX</b> was created under <b>XXYY</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.180-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.180-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=18"}}},{"feedMessageId":21,"feedtypeId":4,"requestTypeId":null,"requestStatusId":null,"domainId":5,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2016-09-17T20:00:00.000-0400","responderDate":"2019-03-25T20:00:00.000-0400","feeds":"<span>Office <b>UUU</b> has a end date set on 26,Mar 2019</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.204-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.204-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=21"}}},{"feedMessageId":15,"feedtypeId":3,"requestTypeId":null,"requestStatusId":null,"domainId":10,"alertTypeName":null,"orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2016-12-14T19:00:00.000-0500","responderDate":null,"feeds":"<span>You are now subscribed to updates in <b>ADMIN</b></span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.177-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.177-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=15"}}},{"feedMessageId":8,"feedtypeId":5,"requestTypeId":null,"requestStatusId":null,"domainId":null,"alertTypeName":"Warning","orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2017-01-09T19:00:00.000-0500","responderDate":"2018-03-15T20:00:00.000-0400","feeds":"<span>Alert Title 8</span>\n    <span>Alert Description Warning</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.146-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.146-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=8"}}},{"feedMessageId":2,"feedtypeId":5,"requestTypeId":null,"requestStatusId":null,"domainId":null,"alertTypeName":"Warning","orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2017-01-14T19:00:00.000-0500","responderDate":"2017-02-27T19:00:00.000-0500","feeds":" <span>Alert Title 2</span>\n    <span>Alert Description Warning</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.140-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.140-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=2"}}},{"feedMessageId":6,"feedtypeId":5,"requestTypeId":null,"requestStatusId":null,"domainId":null,"alertTypeName":"Informational","orgId":null,"level":null,"requestorId":null,"responderId":null,"resquestorDate":"2017-04-18T20:00:00.000-0400","responderDate":"2018-05-20T20:00:00.000-0400","feeds":"  <span>Alert Title 6</span>\n    <span>Alert Description Informational</span>","createdBy":"Admin","createdDate":"2017-09-11T15:21:50.144-0400","lastModifiedBy":"Admin","lastModifiedDate":"2017-09-11T15:21:50.144-0400","_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/allFeeds?feedIds=6"}}}],"_links":{"self":{"href":"https://89feedsservicecomp.apps.prod-iae.bsp.gsa.gov/feeds/v1/notifications?feedTypeId=3,4,5&limit=10&pgNum=1&sortBy=reqDate&order=asc"}}});
    } else if(filterObj.subSection.toLowerCase() === 'alerts'){
      return Observable.of({
        feeds:[
          {type:'Alert', alertType:'error', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'warning', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
        ],
        totalCount: 6,
      });
    } else if(filterObj.subSection.toLowerCase() === 'subscriptions'){
      return Observable.of({
        feeds:[
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
        ],
        totalCount: 144,
      });
    } else{
      return Observable.of({feeds:[], totalCount:0});
    }


  }

}
