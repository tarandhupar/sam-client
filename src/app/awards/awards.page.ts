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
    /*if transaction number is not null
    this.loadAwardData();
    else*/
    this.loadIDVData();
    
  }
  
  private loadAwardData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.AwardsService.getAwardsData("7013", "HSTS0410HREC401", "P90004", "0", "R");
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
      return this.AwardsService.getIDVData("9700", "H922221490002", "P00003", "O");
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
