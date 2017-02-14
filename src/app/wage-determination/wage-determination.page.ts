import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { WageDeterminationService } from 'api-kit';
import { ReplaySubject, Observable } from 'rxjs';
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';
import {FilterMultiArrayObjectPipe} from "../app-pipes/filter-multi-array-object.pipe";

@Component({
  moduleId: __filename,
  templateUrl: 'wage-determination.page.html',
  providers: [
    WageDeterminationService,
    FilterMultiArrayObjectPipe
  ]
})
export class WageDeterminationPage implements OnInit {
  wageDetermination: any;
  referenceNumber: any;
  revisionNumber:any;
  currentUrl: string;
  dictionaries: any;
  states: string;
  counties: string;
  services: string;

  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;

  constructor(
    private FilterMultiArrayObjectPipe: FilterMultiArrayObjectPipe,
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
    }, err => {
      console.log('Error logging', err);
    });

    return apiSubject;
  }

  private loadDictionary() {
    this.wgService.getWageDeterminationDictionary('state, county, services').subscribe(data => {
      // do something with the dictionary api
      this.dictionaries = data;
    }, err => {
      console.log('Error loading dictionaries: ', err);
    });
  }

  private getStatesAndCounties(){

    let statesString = "";
    let countiesString = "";
    let county:string;
    let resultCounty:any;
    for (let location of this.wageDetermination.location){
      let state:string;
      let resultState = this.FilterMultiArrayObjectPipe.transform([location.state], this.dictionaries.state, 'element_id', false, "");
      state = (resultState instanceof Array && resultState.length > 0) ? resultState[0].value : [];
      statesString = statesString.concat(state + ", ");
      countiesString = countiesString.concat(state + " - ");
      for (let countyElement of location.counties){
        county = null;
        (countyElement == null) ? (county = "Statewide") : (resultCounty = this.FilterMultiArrayObjectPipe.transform([countyElement.toString()], this.dictionaries.county, 'element_id', false, ""));
        if (county == null){
          county = (resultCounty instanceof Array && resultCounty.length > 0) ? resultCounty[0].value : [];
        }
        }
      countiesString = countiesString.concat(county + ", ");
      }
    countiesString = countiesString.substring(0, countiesString.length - 2);
    countiesString = countiesString.concat("\n");
    statesString = statesString.substring(0, statesString.length - 2);
    this.states = statesString;
    this.counties = countiesString;


    return true;
  }
  private getServices(){
    let servicesString = "";
    for (let element of this.wageDetermination.services){
      let result = this.FilterMultiArrayObjectPipe.transform([element.toString()], this.dictionaries.services, 'element_id', false, "");
      let services = (result instanceof Array && result.length > 0) ? result[0].value : [];
      servicesString = servicesString.concat(services + ", ");
    }
    servicesString = servicesString.substring(0, servicesString.length - 2);
    this.services = servicesString;
    return true;
  }
}
