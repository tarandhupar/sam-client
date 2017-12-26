import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class ContentManagementServiceMock{
  constructor(private oAPIService: WrapperService) { }

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
            referenceId: 'reference ID', domain:'Assistance Listings', latestUpdate:'2017-01-01',
          },
          {
            type:'Draft',
            title:'Authorization',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'test domain', latestUpdate:'2017-01-01',
          },
          {
            type:'Archived',
            title:'Authorized Date',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'test domain', latestUpdate:'2017-01-01',
          },
          {
            type:'Published',
            title:'Authorized Name',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'test domain', latestUpdate:'2017-01-01',
          },
          {
            type:'New',
            title:'Applicant Eligibility',
            description: 'So journey greatly. Draw door kept do so come on open mean. Estimating stimulated how reasonably precaution diminution she simplicity sir but. Questions am sincerity zealously concluded consisted or no gentleman it.',
            referenceId: 'reference ID', domain:'System Accounts', latestUpdate:'2017-01-01',
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

  getContent() {
    return Observable.of({"_embedded":{"contentDataWrapperList":[{"totalRecords":15,"contentDataList":[{"contentId":88,"refId":"vid-SAM-16","type":3,"status":2,"title":"TRY1","description":"https://55samfrontendcomp.apps.prod-iae.bsp.gsa.gov/workspace/content-management/video-library/edit?mode=create","activeStatus":true,"draftExist":false,"domain":[1,2],"tags":[{"tagId":17,"tagKey":"new tag"}],"sourceUrl":"https://taran-test.s3.amazonaws.com/videos/2017-11-29T19%3A00%3A37.619Z/movie.mp4","duration":"12.612","thumbnailUrl":"https://taran-test.s3.amazonaws.com/videos/thumbnails/2017-11-29T19%3A00%3A37.619Z/movie.png","createdDate":"2017-11-29 14:46:47.757000","lastModifiedDate":"2017-11-29 14:49:22.360000","_links":{"Archive":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/update"},"Edit":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/insert"},"SelfLink":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data?contentid=88&statusid=2&type=3&order=asc"}}},{"contentId":89,"refId":"vid-SAM-17","type":3,"status":2,"title":"new1","description":"new","activeStatus":true,"draftExist":false,"domain":[5],"tags":[{"tagId":17,"tagKey":"new tag"}],"sourceUrl":"https://taran-test.s3.amazonaws.com/videos/2017-11-29T19%3A54%3A46.667Z/VideoFile1-Fortesting.mp4","duration":"12.612","thumbnailUrl":"https://taran-test.s3.amazonaws.com/videos/thumbnails/2017-11-29T19%3A54%3A46.667Z/VideoFile1-Fortesting.png","createdDate":"2017-11-29 14:54:49.366000","lastModifiedDate":"2017-11-29 14:57:37.795000","_links":{"Archive":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/update"},"Edit":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/insert"},"SelfLink":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data?contentid=89&statusid=2&type=3&order=asc"}}},{"contentId":91,"refId":"vid-SAM-18","type":3,"status":2,"title":"second22","description":"second","activeStatus":true,"draftExist":true,"domain":[2,5],"tags":[{"tagId":17,"tagKey":"new tag"}],"sourceUrl":"https://taran-test.s3.amazonaws.com/videos/2017-11-29T19%3A56%3A36.647Z/movie.mp4","duration":"12.612","thumbnailUrl":"https://taran-test.s3.amazonaws.com/videos/thumbnails/2017-11-29T19%3A56%3A36.647Z/movie.png","createdDate":"2017-11-29 14:57:59.713000","lastModifiedDate":"2017-11-29 14:59:02.534000","_links":{"Archive":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/update"},"SelfLink":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data?contentid=91&statusid=2&type=3&order=asc"}}},{"contentId":99,"refId":"vid-SAM-21","type":3,"status":2,"title":"Test New Video pub1","description":"Test New Video pub1","activeStatus":true,"draftExist":false,"tags":[],"sourceUrl":"https://taran-test.s3.amazonaws.com/videos/2017-11-29T21%3A21%3A28.372Z/small.mp4","duration":"5.568","thumbnailUrl":"https://taran-test.s3.amazonaws.com/videos/thumbnails/2017-11-29T21%3A21%3A28.371Z/small.png","createdDate":"2017-11-29 16:21:31.334000","lastModifiedDate":"2017-11-29 16:22:18.875000","_links":{"Archive":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/update"},"Edit":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/insert"},"SelfLink":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data?contentid=99&statusid=2&type=3&order=asc"}}},{"contentId":98,"refId":"vid-SAM-20","type":3,"status":2,"title":"Test New Video pub","description":"Test New Video pub","activeStatus":true,"draftExist":false,"tags":[],"sourceUrl":"https://taran-test.s3.amazonaws.com/videos/2017-11-29T21%3A20%3A32.603Z/katamari-star8-10s-h264.mov","duration":"10.026667","thumbnailUrl":"https://taran-test.s3.amazonaws.com/videos/thumbnails/2017-11-29T21%3A20%3A32.603Z/katamari-star8-10s-h264.png","createdDate":"2017-11-29 16:20:42.626000","lastModifiedDate":"2017-11-29 16:22:25.659000","_links":{"Archive":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/update"},"Edit":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data/insert"},"SelfLink":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data?contentid=98&statusid=2&type=3&order=asc"}}}]}]},"_links":{"self":{"href":"https://93cmsservicecomp.apps.prod-iae.bsp.gsa.gov/content/v1/data?type=3&limit=5&offset=1&order=asc"}}});
  }

  getTags() {
    return Observable.of(['one', 'two']);
  }
}
