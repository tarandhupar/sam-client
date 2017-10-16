import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';
import { Cookie } from "ng2-cookies";

@Injectable()
export class SubscriptionsService{
  constructor(private oAPIService: WrapperService) { }

  getDomains(){
    return Observable.of({
      'Domains':['Assistance Listings', 'Contract Opportunities', 'Contract Awards', 'Entity Information', 'Sub-Awards', 'Wage Determination']
    });
  } 

  addAuthHeader(options) {
    let iPlanetCookie = Cookie.getAll().iPlanetDirectoryPro;
    if (!iPlanetCookie) {
      return;
    }

    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie;
  }

  getSubscriptions(filterObj, sortBy, pageNum, pageSize = 10){
     let queryParams: any = {
      offset: (pageNum * pageSize),
      limit: pageSize,
      sortBy: sortBy.type,
      sortType: sortBy.sort //sort type
    };

    if (filterObj.domains && filterObj.domains) {
      queryParams.domain = filterObj.domains.join(',');
    }
    if (filterObj.frequency && filterObj.frequency) {
      queryParams.frequency = filterObj.frequency.join(',');
    }
    if (filterObj.keyword) {
      queryParams.record = filterObj.keyword;
    }
    if (filterObj.feedType) {
      queryParams.myFeed = filterObj.feedType.join(',');
    }



    let apiOptions: any = {
      name: 'subscriptions',
      suffix: '',
      method: 'GET',
      oParam: queryParams
    };

    
    this.addAuthHeader(apiOptions);

  return this.oAPIService.call(apiOptions);
     /* return Observable.of({
        recordList:[
          {id: 1, record_id: 'O12345', title:'AK2015001-Wage Determination Data...', type:'DBA', domain_id:'Wage Determination', frequency:'daily', lastModified:'Jul 01, 2017', 'myFeed': 'N'},
          {id: 2, record_id: 'CA2017021' , title: 'CA2017021' ,type:'SCA', domain_id:'Wage Determination', frequency:'instant', lastModified:'Jun 10, 2017 '},
          {id: 3, record_id: 'O12345', title: 'CA2017021' ,type:'SCA', domain_id:'Contract Opportunities', frequency:'weekly', lastModified:'Jun 05, 2017'},
          {id: 4, record_id: 'AS99999', title: 'CA2017021' ,type:'SCA', domain_id:'Assistance Listing', frequency:'instant', lastModified:'May 25, 2017'},
          {id: 5, record_id: 'AS88888', title: 'CA2017021' ,type:'SCA', domain_id:'Assistance Listing', frequency:'daily', lastModified:'May 12, 2017', 'myFeed': 'Y'},
          {id: 6, record_id: 'AK2016001', title: 'CA2017021' ,type:'DBA', domain_id:'Wage Determination', frequency:'daily', lastModified:'Jul 01, 2016', 'myFeed': 'N'},
          {id: 7, record_id: 'CA2016021', title: 'CA2016021' ,type:'SCA', domain_id:'Wage Determination', frequency:'instant', lastModified:'Jun 10, 2016 '},
          {id: 8, record_id: 'O1234', title: 'O1234' ,type:'SCA', domain_id:'Contract Opportunities', frequency:'weekly', lastModified:'Jun 05, 2016'},
          {id: 9, record_id: 'AS999990', title: 'AS999990' ,type:'SCA', domain_id:'Assistance Listing', frequency:'instant', lastModified:'May 25, 2016'},
          {id: 10, record_id: 'AS888880', title: 'AS888880' ,type:'SCA', domain_id:'Assistance Listing', frequency:'daily', lastModified:'May 12, 2016', 'myFeed': 'Y'},
        ],
        totalRecords: 150,
      }); */
    }

  updateSubscriptions(filterObj, allMatchingSelected, fieldName, fieldValue){
    let filters: any = {};
      if(!allMatchingSelected) {
        filters.ids = filterObj.ids;
      } else {
        if (filterObj.domains && filterObj.domains) {
          filters.domain = filterObj.domains.join(',');
        }
        if (filterObj.frequency && filterObj.frequency) {
          filters.frequency = filterObj.frequency.join(',');
        }
        if (filterObj.keyword) {
          filters.record = filterObj.keyword;
        }
      }

      let request: any = {
        field: fieldName,
        value: fieldValue,
        filters: filters
      };

      let apiOptions: any = {
        name: 'subscriptions',
        suffix: '',
        method: 'PUT',
        body: request
      };

      
      this.addAuthHeader(apiOptions);

      return this.oAPIService.call(apiOptions);
    }
}
