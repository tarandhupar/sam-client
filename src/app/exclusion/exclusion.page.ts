import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ExclusionService } from 'api-kit';
import { ReplaySubject } from 'rxjs';
import {CapitalizePipe} from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'exclusion.page.html',
  providers: [
    ExclusionService
  ]
})
export class ExclusionsPage implements OnInit, OnDestroy {
  currentUrl: string;
  subscription: Subscription;
  exclusion: any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private ExclusionService: ExclusionService) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadExclusion();

  }

   private loadExclusion() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
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
