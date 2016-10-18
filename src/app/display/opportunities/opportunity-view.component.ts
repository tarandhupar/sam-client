import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SearchService } from 'api-kit/search/search.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-view.component.html',
  styleUrls: ['opportunity-view.style.css'],
  providers: [
    SearchService,
  ]
})
export class OpportunityViewComponent implements OnInit, OnDestroy {
  oNotice:any;
  oSub: Subscription;
  currentUrl: string;

  constructor(
    private route:ActivatedRoute,
    private oSearchService:SearchService,
    private oLocation: Location) {}

  ngOnInit() {
    this.currentUrl = this.oLocation.path();

    this.oSub = this.route.params.subscribe(params => {
      this.oSearchService.runSearch({
        keyword: '',
        index: 'fbo',
        pageNum: 0,
        noticeId: params['id']
      }).subscribe(result => {
        this.oNotice = result._embedded.results[0];
      });
    });
  }

  ngOnDestroy() {
    this.oSub.unsubscribe();
  }
}
