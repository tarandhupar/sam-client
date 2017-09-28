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

  getFeeds(filterObj, sortBy, orderBy, pageNum, pageSize = 20){
    if(filterObj.section.toLowerCase() === 'requests'){
      return this.getRequestsFeed(filterObj, sortBy, orderBy, pageNum, pageSize);
    }else{
      return this.getNotificationFeeds(filterObj, sortBy, orderBy, pageNum, pageSize);
    }
  }

  getRequestsFeed(filterObj, sortBy, orderBy, pageNum, pageSize = 20){
    if(filterObj.subSection === ''){
      return Observable.of({
        feeds:[
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Rejected', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Rejected', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Approved', description:'Description lipsum text', date:'June 1'},
          {type:'Request', status: 'Pending', description:'Description lipsum text', date:'June 1'},
        ],
        totalCount: 10,
      });
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

  getNotificationFeeds(filterObj, sortBy, orderBy, pageNum, pageSize = 20){
    if(filterObj.subSection === '') {
      return Observable.of({
        feeds:[
          {type:'Alert', alertType:'error', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'warning', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          // {type:'Alert', alertType:'error', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          // {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          // {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          // {type:'Alert', alertType:'warning', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          // {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          // {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          // {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          // {type:'Subscription', description:'Description lipsum text', date:'June 1'},
          // {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},
          // {type:'Alert', alertType:'info', title:'Test alert title', description:'Description lipsum text', date:'June 1'},

        ],
        totalCount: 150,
      });
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
