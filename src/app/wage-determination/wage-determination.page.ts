import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { WageDeterminationService } from 'api-kit';
import { ReplaySubject, Observable } from 'rxjs';
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'wage-determination.page.html',
  providers: [
    WageDeterminationService
  ]
})
export class WageDeterminationPage implements OnInit {
  wageDetermination: any;
  referenceNumber: any;
  revisionNumber:any;
  currentUrl: string;
  dictionary: any;

  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private wgService:WageDeterminationService) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.getElementById(tree.fragment);
          if (element) { element.scrollIntoView(); }
        }
      }
    });
  }

  ngOnInit() {
    // Using document.location.href instead of
    // location.path because of ie9 bug
    this.currentUrl = document.location.href;
    this.loadDictionary();
    this.loadWageDetermination();
  }

  private loadWageDetermination() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.route.params.switchMap(params => { // construct a stream of api data
      this.referenceNumber = params['referencenumber'];
      this.revisionNumber = params['revisionnumber'];
      return this.wgService.getWageDeterminationByReferenceNumberAndRevisionNumber(params['referencenumber'],params['revisionnumber']);
    });
    this.apiStreamSub = apiStream.subscribe(apiSubject);

    this.apiSubjectSub = apiSubject.subscribe(api => {
      // run whenever api data is updated
      this.wageDetermination = api;
      console.log("Wage Determination: ", this.wageDetermination);
    }, err => {
      console.log('Error logging', err);
    });

    return apiSubject;
  }

  private loadDictionary() {
    this.wgService.getWageDeterminationDictionary('state, county').subscribe(data => {
      // do something with the dictionary api
      this.dictionary = data;
      console.log("Dictionary:", this.dictionary);
    }, err => {
      console.log('Error loading dictionaries: ', err);
    });
  }

}
