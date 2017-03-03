import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
    private AwardsService: AwardsService) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadOTIData();
  }
  
  private loadAwardData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.AwardsService.getAwardsData("4740", "GS04P14EXC0125", "PS03", "0", "D");
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.awardData = jsonData;
    }, err => {
      console.log('Error logging', err);
    });
   }
   
   private loadIDVData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.AwardsService.getIDVData("3600", "VA24615A0024", "0", "E");
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.awardData = jsonData;
    }, err => {
      console.log('Error logging', err);
    });
   }
   
   private loadOTAData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.AwardsService.getOTAData("7013", "HSTS0213HSLR316", "P00003", "0", "R");
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.awardData = jsonData;
    }, err => {
      console.log('Error logging', err);
    });
   }
   
    private loadOTIData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.AwardsService.getOTIData("9700", "HR00111590002", "P00002", "O");
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.awardData = jsonData;
    }, err => {
      console.log('Error logging', err);
    });
   }
  
  changeSubNav(value){
    this.currentSubNav = value;
  }
  
  isCurrentSubNav(value){
    return this.currentSubNav === value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
