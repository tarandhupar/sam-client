import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { WageDeterminationService } from "api-kit";
import { ReplaySubject, Observable } from "rxjs";
import * as _ from 'lodash';
import { FilterMultiArrayObjectPipe } from "../app-pipes/filter-multi-array-object.pipe";
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import {DateFormatPipe} from "../app-pipes/date-format.pipe";


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
  revisionNumber: any;
  currentUrl: string;
  dictionaries: any;
  services: string;
  constructionTypes: string;
  public locations: any;
  history: any;
  processedHistory: any;
  longProcessedHistory: any;
  shortProcessedHistory: any;
  showingLongHistory = false;

  // On load select first item on sidenav component
  selectedPage: number = 0;
  pageRoute: string;
  pageFragment: string;
  sidenavModel = {
    "label": "WD",
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
        this.pageFragment = tree.fragment;
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
    this.getLocations(wgAndDictionariesAPI);
    let wdHistoryAPI = this.loadHistory(wdAPI);
    let DOMReady$ = Observable.zip(wgAndDictionariesAPI, wdHistoryAPI).delay(2000);
    this.DOMComplete(DOMReady$);
    this.sidenavService.updateData(this.selectedPage, 0);
  }

  private loadWageDetermination() {
      let wgSubject = new ReplaySubject(1); // broadcasts the opportunity to multiple subscribers
    this.route.params.subscribe((params: Params) => { // construct a stream of wg data
      this.referenceNumber = params['referencenumber'];
      this.isSCA = this.referenceNumber.indexOf('-') > -1;
      this.revisionNumber = params['revisionnumber'];
      this.wgService.getWageDeterminationByReferenceNumberAndRevisionNumber(this.referenceNumber,this.revisionNumber).subscribe(wgSubject);
      // run whenever api data is updated
      wgSubject.subscribe(api => { // do something with the wg api
        this.wageDetermination = api;

        this.pageRoute = "wage-determination/" + this.referenceNumber + "/" + this.revisionNumber;
        let wageDeterminationSideNavContent = {
          "label": "Wage Determination",
          "route": this.pageRoute,
          "children": [
            {
              "label": "Overview",
              "field": "#wage-determination",
            },
            {
              "label": "Document",
              "field": "#wd-document",
            },
            {
              "label": "History",
              "field": "#wd-history",
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

  selectedItem(item){
    this.selectedPage = this.sidenavService.getData()[0];
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
          possibleSection.route = possibleSection.field;
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
    this.wgService.getWageDeterminationDictionary('wdStates, wdCounties, scaServices').subscribe(dictionariesSubject);
    dictionariesSubject.subscribe(data => {
      // do something with the dictionary api
      this.dictionaries = data;
    }, err => {
      console.log('Error loading dictionaries: ', err);
    });
    return dictionariesSubject;
  }

  private DOMComplete(observable){
    observable.subscribe(
      () => {
        if (this.pageFragment && document.getElementById(this.pageFragment)) {
          document.getElementById(this.pageFragment).scrollIntoView();
        }
      },
      () => {
        if (this.pageFragment && document.getElementById(this.pageFragment)) {
          document.getElementById(this.pageFragment).scrollIntoView();
      }
    });
  }

  sidenavPathEvtHandler(data){
    data = data.indexOf('#') > 0 ? data.substring(data.indexOf('#')) : data;

    if (this.pageFragment == data.substring(1)) {
      document.getElementById(this.pageFragment).scrollIntoView();
    }
    else if(data.charAt(0)=="#"){
            this.router.navigate([], { fragment: data.substring(1) });
    } else {
            this.router.navigate([data]);
    }
  }

  private getLocations(combinedAPI: Observable<any>){
    combinedAPI.subscribe(([wageDetermination, dictionaries]) => {
      /** Check that locations exist **/
      if(!wageDetermination.location) {
        return;
      }

      /** Process each location data into a usable state **/
      for (let eachLocation of wageDetermination.location) {
        /** Process States **/
        // given a state code, look up the dictionary entry for that state (returns array of matches)
        let filterMultiArrayObjectPipe = new FilterMultiArrayObjectPipe();
        let stateDictionary = _.find(dictionaries._embedded['dictionaries'], { id: 'wdStates' }).elements;
        let resultStates = filterMultiArrayObjectPipe.transform([eachLocation.state], stateDictionary, 'elementId', false, '');

        // if a matching state was found, display its name otherwise display a warning message
        eachLocation.stateString = (resultStates.length > 0) ? resultStates[0].value : 'Unknown state';

        /** Process Counties **/
        // if statewide flag is set AND counties are listed, those counties are exceptions within that state
        if (eachLocation.statewideFlag && eachLocation.counties == null) {
          // no exceptions so just display 'Statewide'
          eachLocation.countiesString = 'Statewide';
        } else if (eachLocation.counties != null) {
          // if there are any exceptions, display 'All counties except' before the list of counties
          let countiesPrefix = eachLocation.statewideFlag ? 'All Counties except: ' : '';
          let countiesDictionary = _.find(dictionaries._embedded['dictionaries'], { id: 'wdCounties' }).elements;
          eachLocation.countiesString = countiesPrefix + this.getCounties(eachLocation.counties, countiesDictionary);
        }
      }

      this.locations = wageDetermination.location;
    })
  }

  /** Takes a list of county ids and processes them into a comma separated list of county names **/
  private getCounties(counties: any[], countyDictionary: any[]): string {
    /** Process the input **/
    let countiesList = counties
      .filter(county => { return county != null; }) // filter out any null values
      .map(county => { return county.toString(); }); // convert from number ids to strings

    /** Look up county names in dictionary **/
    let filterMultiArrayObjectPipe = new FilterMultiArrayObjectPipe();
    let resultCounties = filterMultiArrayObjectPipe.transform(countiesList, countyDictionary, 'elementId', false, '');

    // if any county is not found, show a warning message
    let warning = '';
    if (resultCounties.length !== counties.length) {
      warning += '(' + (counties.length - resultCounties.length).toString() + ' unknown counties)';
    }

    // otherwise take the names of all the found counties and join them into a comma separated string
    return resultCounties.map(county => { return county.value }).join(', ') + warning;
  }

  private getServices(combinedAPI: Observable<any>) {
    combinedAPI.subscribe(([wageDeterminaton, dictionaries]) => {
      if (wageDeterminaton.services != null) {
        let servicesString = "";
        for (let element of wageDeterminaton.services) {
          let servicesDictionary = _.find(dictionaries._embedded['dictionaries'], { id: 'scaServices' }).elements;
          let result = this.FilterMultiArrayObjectPipe.transform([element.toString()], servicesDictionary, 'elementId', false, "");
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

  private loadHistory(wageDetermination: Observable<any>) {

    let historySubject = new ReplaySubject(1);
    wageDetermination.subscribe(wageDeterminationAPI => {
      /** Check that wageDetermination reference and revision numbers exist **/
      if(wageDeterminationAPI.fullReferenceNumber === '' || typeof wageDeterminationAPI.fullReferenceNumber === 'undefined' || wageDeterminationAPI.revisionNumber === '' || typeof wageDeterminationAPI.revisionNumber === 'undefined') {
        console.log('Error loading history');
        return;
      }
      /** Load history API **/
      this.wgService.getWageDeterminationHistoryByReferenceNumber(wageDeterminationAPI.fullReferenceNumber).subscribe(historySubject);
      historySubject.subscribe(historyAPI => {
        this.history = historyAPI; // save original history information in case it is needed

        /** Setup necessary variables and functions for processing history **/
        let dateFormat = new DateFormatPipe();


        /** Process history into a form usable by history component **/
        let processHistoryItem = function(historyItem) {
          let processedHistoryItem = {};
          processedHistoryItem['id'] = historyItem.fullReferenceNumber + '/' + historyItem.revisionNumber;
          processedHistoryItem['title'] = historyItem.fullReferenceNumber + ' - Revision ' + historyItem.revisionNumber;
          processedHistoryItem['date'] = dateFormat.transform(historyItem.publishDate, 'MMMM DD, YYYY');
          processedHistoryItem['url'] = 'wage-determination/' + historyItem.fullReferenceNumber + '/' + historyItem.revisionNumber;
          processedHistoryItem['index'] = historyItem.revisionNumber;
          processedHistoryItem['authoritative'] = historyItem.active;
          return processedHistoryItem;
        };
        this.longProcessedHistory = this.history._embedded.wageDetermination.map(processHistoryItem);
        if (this.longProcessedHistory.length > 5) {
          this.shortProcessedHistory = this.longProcessedHistory.slice(0,5);
          this.processedHistory = this.shortProcessedHistory;
        } else {
          this.processedHistory = this.longProcessedHistory;
        }
        //sort by index to show history by version (oldest to newest)
        //this.processedHistory = _.sortBy(this.processedHistory, function(item){ return item.revisionNumber; });
      }, err => {
        console.log('Error loading history: ', err);
      });

    });
    return historySubject;
  }

  private showHideLongHistory(){
    if (this.showingLongHistory == false){
      this.processedHistory = this.longProcessedHistory;
      this.showingLongHistory = true;
    } else {
      this.processedHistory = this.shortProcessedHistory;
      this.showingLongHistory = false;
    }
  }
}
