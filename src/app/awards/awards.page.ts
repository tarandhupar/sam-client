import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { AwardsService } from 'api-kit';
import { ReplaySubject } from 'rxjs';
import {CapitalizePipe} from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'awards.page.html',
  providers: [
    AwardsService
  ]
})
export class AwardsPage implements OnInit, OnDestroy {
  currentUrl: string;
  awardData: any;
  private currentSubNav: string;
  subscription: Subscription;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private AwardsService: AwardsService) {
      router.events.subscribe(s => {
        if (s instanceof NavigationEnd) {
          const tree = router.parseUrl(router.url);
          if (tree.fragment) {
            const element = document.getElementById(tree.fragment);
            if (element) {
              element.scrollIntoView();
            }
          } else {
            window.scrollTo(0,0);
          }
        }
      });
    }

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadAwardData();
  }
  
  private loadAwardData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.AwardsService.getAwardsData(params['id']);
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.awardData = jsonData.awardsDetails;
    }, err => {
      console.log('Error logging', err);
    });
   }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
