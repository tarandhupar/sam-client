import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, NavigationEnd, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { WageDeterminationService } from 'api-kit';
import { ReplaySubject, Observable } from 'rxjs';
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';
import { FilterMultiArrayObjectPipe } from "../app-pipes/filter-multi-array-object.pipe";
import { SidenavService } from "../../ui-kit/sidenav/services/sidenav.service";
import { StatesCountiesPipe } from "./pipes/states-counties.pipe";


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
  isSCA: boolean;
  referenceNumber: any;
  revisionNumber:any;
  currentUrl: string;
  dictionaries: any;
  states: string;
  counties: string;
  services: string;
  constructionTypes: string;

  // On load select first item on sidenav component
  selectedPage: number = 0;
  pageRoute: string;
  sidenavModel = {
    "label": "Wage Determination",
    "children": []
  };

  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;

  constructor(
    private sidenavService: SidenavService,
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
    let dictionariesAPI = this.loadDictionary();
    let wdAPI = this.loadWageDetermination();
    let wgAndDictionariesAPI = wdAPI.zip(dictionariesAPI);
    this.isSCA ? this.getServices(wgAndDictionariesAPI) : this.getConstructionTypes(wdAPI);
    this.getStatesAndCounties(wgAndDictionariesAPI);
    this.sidenavService.updateData(this.selectedPage, 0);
  }

  private loadWageDetermination() {
      let wgSubject = new ReplaySubject(1); // broadcasts the opportunity to multiple subscribers
    this.route.params.subscribe((params: Params) => { // construct a stream of wg data
      console.log("Params: ", params);
      this.referenceNumber = params['referencenumber'];
      this.isSCA = this.referenceNumber.indexOf('-') > -1;
      this.revisionNumber = params['revisionnumber'];
      this.wgService.getWageDeterminationByReferenceNumberAndRevisionNumber(this.referenceNumber,this.revisionNumber).subscribe(wgSubject);
      // run whenever api data is updated
      wgSubject.subscribe(api => { // do something with the wg api
        this.wageDetermination = api;
        console.log("Revision Number: ", this.wageDetermination.revisionNumber)

        let wageDeterminationSideNavContent = {
          "label": "Wage Determination",
          "route": "wage-determination/"+this.wageDetermination.fullReferenceNumber+"/"+this.wageDetermination.revisionNumber,
          "children": [
            {
              "label": "SCA WD #" + this.wageDetermination.fullReferenceNumber,
              "field": "wage-determination",
            }
          ]
        };
        this.updateSideNav(wageDeterminationSideNavContent);
      }, err => {
        console.log('Error logging', err);
      });
    });

    return wgSubject;
  }

  private updateSideNav(content?){

    let self = this;

    if(content){
      // Items in first level (pages) have to have a unique name
      let repeatedItem = _.findIndex(this.sidenavModel.children, item => item.label == content.label );
      // If page has a unique name added to the sidenav
      if(repeatedItem === -1){
        this.sidenavModel.children.push(content);
      }
    }

    updateContent();

    function updateContent(){
      let children = _.map(self.sidenavModel.children, function(possiblePage){
        let possiblePagechildren = _.map(possiblePage.children, function(possibleSection){
          possibleSection.route = "#" + possibleSection.field;
          return possibleSection;
        });
        _.remove(possiblePagechildren, _.isUndefined);
        possiblePage.children = possiblePagechildren;
        return possiblePage;
      });
      self.sidenavModel.children = children;
    }

  }

  private loadDictionary() {
    let dictionariesSubject = new ReplaySubject(1);
    this.wgService.getWageDeterminationDictionary('state, county, services').subscribe(dictionariesSubject);
    dictionariesSubject.subscribe(data => {
      // do something with the dictionary api
      this.dictionaries = data;
    }, err => {
      console.log('Error loading dictionaries: ', err);
    });
    return dictionariesSubject;
  }

  sidenavPathEvtHandler(data){
    data = data.indexOf('#') > 0 ? data.substring(data.indexOf('#')) : data;
		if(data.charAt(0)=="#"){
			this.router.navigate([], { fragment: data.substring(1) });
		} else {
			this.router.navigate([data]);
		}
	}

  private getStatesAndCounties(combinedAPI: Observable<any>){
    combinedAPI.subscribe(([wageDeterminaton, dictionaries]) => {
      let statesCountiesPipe = new StatesCountiesPipe();
      let strings = statesCountiesPipe.transform(wageDeterminaton.location, dictionaries);
      this.states = strings.states;
      this.counties = strings.counties;
    })
  }

  private getServices(combinedAPI: Observable<any>) {
    combinedAPI.subscribe(([wageDeterminaton, dictionaries]) => {
      if (wageDeterminaton.services != null){
          let servicesString = "";
        for (let element of wageDeterminaton.services) {
          let result = this.FilterMultiArrayObjectPipe.transform([element.toString()], dictionaries.services, 'element_id', false, "");
          let services = (result instanceof Array && result.length > 0) ? result[0].value : [];
          servicesString = servicesString.concat(services + ", ");
        }
        servicesString = servicesString.substring(0, servicesString.length - 2);
        this.services = servicesString;
      }
    })
  }

  private getConstructionTypes(wdAPI) {
    wdAPI.subscribe((wageDeterminaton) => {
      if (wageDeterminaton.constructionType != null){
        let constructionTypeString = "";
        for (let element of wageDeterminaton.constructionType) {
          constructionTypeString = constructionTypeString.concat(element + ", ");
        }
        constructionTypeString = constructionTypeString.substring(0, constructionTypeString.length - 2);
        this.constructionTypes = constructionTypeString;
      }
    })
  }

  public openDocumentPrintPage() {
    var win = window.open('', 'Document');
    win.document.body.innerHTML = '<pre>' + this.wageDetermination.document + '</pre>';
  }
}
