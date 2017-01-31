import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { EntityService } from 'api-kit';
import { ReplaySubject } from 'rxjs';
import {CapitalizePipe} from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'entity-object-view.page.html',
  providers: [
    EntityService
  ]
})
export class EntityPage implements OnInit, OnDestroy {
  currentUrl: string;
  coreData: any;
  assertions: any;
  repsAndCerts: any;
  mandatoryPOCs: any;
  optionalPOCs: any;
  subscription: Subscription;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private EntityService: EntityService) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadEntityData();

  }

   private loadEntityData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.EntityService.getCoreDataById(params['id']);
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.coreData = jsonData.entityInfo.coreData;
      this.assertions = jsonData.entityInfo.assertions;
      this.repsAndCerts = jsonData.entityInfo.repsAndCerts;
      this.mandatoryPOCs = jsonData.entityInfo.mandatoryPOCs;
  	  this.optionalPOCs = jsonData.entityInfo.optionalPOCs;
    }, err => {
      console.log('Error logging', err);
    });
   }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
