import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionsService{
  constructor(private oAPIService: WrapperService) { }

  getDomains(){
    return Observable.of({
      'Domains':['Assistance Listings', 'Contract Opportunities', 'Contract Awards', 'Entity Information', 'Sub-Awards', 'Wage Determinations']
    });
  }


  getSubscriptions(filterObj, sortBy, pageNum, pageSize = 20){

     let queryParams: any = {
      offset: (pageNum * pageSize) + 1,
      limit: pageSize,
      sortBy: sortBy.type,
      sortType: sortBy.sort
    };

    if (filterObj.domains && filterObj.domains) {
      queryParams.domain = filterObj.domains.join(',');
    }
    if (filterObj.frequency && filterObj.frequency) {
      queryParams.frequency = filterObj.frequency.join(',');
    }
    if (filterObj.keyword) {
      queryParams.name = filterObj.keyword;
    }


      return Observable.of({
        recordList:[
          {id: 1, recordId: 'AK2015001-Wage Determination Data...', type:'DBA', domainId:'Wage Determination', frequency:'daily', lastModified:'Jul 01, 2017', 'myFeed': 'N'},
          {id: 2, recordId: 'CA2017021', type:'SCA', domainId:'Wage Determination', frequency:'instant', lastModified:'Jun 10, 2017 '},
          {id: 3, recordId: 'O12345', type:'SCA', domainId:'Contract Opportunities', frequency:'weekly', lastModified:'Jun 05, 2017'},
          {id: 4, recordId: 'AS99999', type:'SCA', domainId:'Assistance Listing', frequency:'instant', lastModified:'May 25, 2017'},
          {id: 5, recordId: 'AS88888', type:'SCA', domainId:'Assistance Listing', frequency:'daily', lastModified:'May 12, 2017', 'myFeed': 'Y'},
          {id: 6, recordId: 'AK2016001', type:'DBA', domainId:'Wage Determination', frequency:'daily', lastModified:'Jul 01, 2016', 'myFeed': 'N'},
          {id: 7, recordId: 'CA2016021', type:'SCA', domainId:'Wage Determination', frequency:'instant', lastModified:'Jun 10, 2016 '},
          {id: 8, recordId: 'O1234', type:'SCA', domainId:'Contract Opportunities', frequency:'weekly', lastModified:'Jun 05, 2016'},
          {id: 9, recordId: 'AS999990', type:'SCA', domainId:'Assistance Listing', frequency:'instant', lastModified:'May 25, 2016'},
          {id: 10, recordId: 'AS888880', type:'SCA', domainId:'Assistance Listing', frequency:'daily', lastModified:'May 12, 2016', 'myFeed': 'Y'},          
        ],
        totalRecords: 150,
      });
    }
}
