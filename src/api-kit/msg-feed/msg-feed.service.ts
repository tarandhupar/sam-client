import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

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

    return this.oAPIService.call(oApiParam);
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

    return this.oAPIService.call(oApiParam);

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
    if(filterObj.alertType.length > 0) oApiParam.oParam['alertType'] = filterObj.alertType.join(',');
    if(filterObj.domains.length > 0) oApiParam.oParam['domainIds'] = filterObj.domains.join(',');
    if(filterObj.keyword !== "") oApiParam.oParam['q'] = filterObj.keyword;

    return this.oAPIService.call(oApiParam);



  }

}
