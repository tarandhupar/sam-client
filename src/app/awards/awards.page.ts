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
  feeForUseOfService: any;
  private currentSubNav: string;
  subscription: Subscription;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private AwardsService: AwardsService) {}

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
      this.awardData = jsonData.response;
	  this.getFeeForUseOfService(jsonData.response.contractMarketingData);
    }, err => {
      console.log('Error logging', err);
    });
   }
   
 private getFeeForUseOfService(contractMarketingData){
	 if(contractMarketingData != null)
	 {
		 let feeType = contractMarketingData.feeForUseOfService;
		 let feeLower = contractMarketingData.feeRangeLowerValue;
		 let feeUpper = contractMarketingData.feeRangeUpperValue;
		 let feeFixedValue = contractMarketingData.fixedFeeValue;
		 if(feeType === 'RANGE - VARIES BY AMOUNT')
		 {
			this.feeForUseOfService = feeType.substring(8) + ', ' + feeLower + '-' + feeUpper;
		 }
		 else if(feeType === 'RANGE - VARIES BY OTHER FACTOR')
		 {
			this.feeForUseOfService = feeType.substring(8) + ', ' + feeLower + '-' + feeUpper;
		 }
		 else if(feeType === 'FIXED')
		 {
			this.feeForUseOfService = feeType + ', ' + feeFixedValue + '%';
		 }
		 else if(feeType === 'NO FEE')
		 {
			this.feeForUseOfService = feeType;
		 }
	 }
 }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
