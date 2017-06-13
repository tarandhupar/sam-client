import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ExclusionService } from 'api-kit';
import { ReplaySubject } from 'rxjs';
import {CapitalizePipe} from "../app-pipes/capitalize.pipe";
import { BackToSearch } from "../app-utils/back-to-search-helper";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'exclusion.page.html',
  providers: [
    ExclusionService,
	BackToSearch
  ]
})
export class ExclusionsPage implements OnInit, OnDestroy {
  currentUrl: string;
  subscription: Subscription;
  exclusion: any;
  qParams:any = {};
  linkedObjectView: any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private ExclusionService: ExclusionService,
	private backToSearch: BackToSearch) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadExclusion();
	this.qParams = this.backToSearch.setqParams();
  }

   private loadExclusion() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      this.linkedObjectView = params['link'];
	  return this.ExclusionService.getExclusion(params['id']);
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.exclusion = jsonData.exclusionDetails;
    }, err => {
      console.log('Error logging', err);
    });
   }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
