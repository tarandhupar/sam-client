import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContentManagementService{
  constructor(private oAPIService: WrapperService) { }

  getContentItem(id, type){
    let res;
    if(type.toLowerCase() === 'data-dictionary'){
      res = this.getDataDictionaryContent({},{},0,10);
    }else if(type.toLowerCase() === 'faq-repository'){
      res = this.getFAQContent({},{},0,10);
    }else{
      res = this.getVideoLibraryContent({},{},0,10);
    }
    return res.map(data => {return data['contents'][id]});
  }

  getVideoLibraryContent(filterObj, sort, pageNum, pageSize = 10){
    return Observable.of({
      totalCount: 150,
      contents:
        [
          {
            type:'Published',
            title:'Welcome to SAM.gov',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'Vid-SAM-002110', domains:'Contract Awards, Entity Information', keywords: '#keyword #sample',
            video: {time:'4:50', link:'test-link'}
          },
          {
            type:'Draft',
            title:'New Users of Assistance Listings',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'Vid-SAM-002110', domains:'Assistance Listings', keywords: '#keyword #sample',
            video: {time:'12:50', link:'test-link'}
          },
          {
            type:'Archived',
            title:'Doing Business with the Federal Government',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'Vid-SAM-002110', domains:'Entity Information, Contract Data, Wage Determinations', keywords: '#keyword #sample',
            video: {time:'40:03', link:'test-link'}
          },
          {
            type:'Published',
            title:'How SAM.gov can help you',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'Vid-SAM-002110', domains:'Contract Awards, Entity Information', keywords: '#keyword #sample',
            video: {time:'1:02:00', link:'test-link'}
          },
        ]
    });
  }

  getDataDictionaryContent(filterObj, sort, pageNum, pageSize = 10){
    return Observable.of({
      totalCount: 150,
      contents:
        [
          {
            type:'Published',
            title:'Applicant Eligibility',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
            source:'test source',
          },
          {
            type:'Draft',
            title:'Authorization',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
            source:'test source',
          },
          {
            type:'Archived',
            title:'Authorized Date',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
            source:'test source',
          },
          {
            type:'Published',
            title:'Authorized Name',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
            source:'test source',
          },
          {
            type:'New',
            title:'Applicant Eligibility',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
            source:'test source',
          },
        ]
    });
  }

  getFAQContent(filterObj, sortBy, orderBy, pageNum, pageSize = 10){
    return Observable.of({
      totalCount: 150,
      contents:
        [
          {
            type:'Published',
            title:'What types of assistance can I search?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings','Contract Opportunities'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
          },
          {
            type:'Draft',
            title:'How do I apply for a grant?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
          },
          {
            type:'Archived',
            title:'How can I migrate my accounts to the new SAM.gov?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
          },
          {
            type:'Published',
            title:'How do I update my SAM.gov registration?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:'Assistance Listings',
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
          },
          {
            type:'New',
            title:'What is single sign on?',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID',
            domain:['Assistance Listings'],
            latestUpdate:'2017-01-01',
            keywords: ['keyword', 'sample'],
          },
        ]
    });
  }

}
