import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContentManagementServiceMock{
  constructor(private oAPIService: WrapperService) { }

  getFAQContent(filterObj, sortBy, orderBy, pageNum, pageSize = 10){
    return Observable.of({
      totalCount: 150,
      contents:
        [
          {
            type:'Published',
            title:'What types of assistance can I search?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'Assistance Listings', latestUpdate:'2017-01-01',
          },
          {
            type:'Draft',
            title:'How do I apply for a grant?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'test domain', latestUpdate:'2017-01-01',
          },
          {
            type:'Archived',
            title:'How can I migrate my accounts to the new SAM.gov?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'test domain', latestUpdate:'2017-01-01',
          },
          {
            type:'Published',
            title:'How do I update my SAM.gov registration?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'test domain', latestUpdate:'2017-01-01',
          },
          {
            type:'New',
            title:'What is single sign on?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'System Accounts', latestUpdate:'2017-01-01',
          },
        ]
    });
  }

}
