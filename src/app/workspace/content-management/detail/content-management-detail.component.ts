import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { CMSMapping } from "../content-management-mapping";

@Component({
  templateUrl: './content-management-detail.template.html',
})
export class HelpContentManagementDetailComponent {

  private crumbs: Array<IBreadcrumb> = [
    { url: '', breadcrumb: 'Back to Search' },
  ];
  baseUrl = '/workspace/content-management/';

  sectionTitle = '';
  curSection = '';

  content;
  dataLoaded = false;

  cmsMapping = new CMSMapping();
  domainMap = {};

  constructor(private _router:Router,
              private route: ActivatedRoute,
              private msgFeedService: MsgFeedService,
              private capitalPipe: CapitalizePipe,
              private contentManagementService: ContentManagementService){}

  ngOnInit(){
    this.setDomainMap();
    this.route.params.subscribe(
      params => {
        if(!this.cmsMapping.isSectionValid(params['section'])) this._router.navigateByUrl('/404');
        this.curSection = params['section'];
        this.sectionTitle = this.cmsMapping.getSectionTextName(params['section']);
        this.crumbs[0].url = this.baseUrl + this.curSection;

        let queryParams = this.route.snapshot.queryParams;
        this.loadContentData(queryParams['id'], this.curSection);

      }
    );

  }

  loadContentData(contentId, section){
    this.contentManagementService.getContentItem(contentId, section).subscribe(
      data => {
        this.content = data._embedded["contentDataWrapperList"][0].contentDataList[0];
        this.dataLoaded = true;
      },
      error => {this._router.navigateByUrl('/404');}
    )
  }


  setDomainMap(){
    this.msgFeedService.getDomains().subscribe(data =>{
        this.domainMap = data;
    });
  }

  getKeywordsText(){
    if(this.content['tags'] == null) return 'Not Available';
    if(this.content['tags'].length == 0) return 'Not Available';
    let keywordsTexts = [];
    this.content['tags'].forEach(tag => {
      keywordsTexts.push(tag.tagKey);
    });
    return keywordsTexts.join(',');
  }

  getDomainListStr(){
    if(this.content['domain'] == null) return 'Not Available';
    if(this.content['domain'].length == 0) return 'Not Available';
    let domainList = [];
    this.content['domain'].forEach(e => {
      domainList.push(this.domainMap[e]);
    });
    return domainList.join(', ');
  }

}
