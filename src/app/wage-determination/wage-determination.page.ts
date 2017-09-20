import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { WageDeterminationService } from "api-kit";
import { ReplaySubject, Observable } from "rxjs";
import * as _ from 'lodash';
import { FilterMultiArrayObjectPipe } from "../app-pipes/filter-multi-array-object.pipe";
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import {DateFormatPipe} from "../app-pipes/date-format.pipe";
import {ProcessWageDeterminationHistory} from "./pipes/process-wd-history.pipe";
import {SidenavHelper} from "../app-utils/sidenav-helper";
import {DictionaryService} from "../../api-kit/dictionary/dictionary.service";

@Component({
  moduleId: __filename,
  templateUrl: 'wage-determination.page.html',
  providers: [
    WageDeterminationService,
    FilterMultiArrayObjectPipe,
    SidenavHelper
  ]
})
export class WageDeterminationPage implements OnInit {
  wageDetermination: any;
  isSCA: boolean;
  referenceNumber: any;
  revisionNumber: any;
  currentUrl: string;
  services: string;
  servicesArray:any = [];
  constructionTypes: string;
  locationDescription: String = null;
  locations: any[];
  processedHistory: any;
  longProcessedHistory: any;
  shortProcessedHistory: any;
  showingLongHistory = false;
  revisionMessage: boolean = false;
  qParams: any;
  dictionariesUpdated: boolean = false;

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
    private sidenavHelper: SidenavHelper,
    private FilterMultiArrayObjectPipe: FilterMultiArrayObjectPipe,
    private router: Router,
    private route: ActivatedRoute,
    private dictionaryService: DictionaryService,
    private wgService: WageDeterminationService) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        this.pageFragment = tree.fragment;
      }
    });

    route.queryParams.subscribe(data => {
      this.qParams = data;
    });
  }

  ngOnInit() {
    // Using document.location.href instead of
    // location.path because of ie9 bug
    this.currentUrl = document.location.href;
    let dictionariesAPI = this.loadDictionary();
    let wdAPI = this.loadWageDetermination();
    let wgAndDictionariesAPI = Observable.combineLatest(wdAPI, dictionariesAPI, this.route.params);
    this.isSCA ? this.getServices(wgAndDictionariesAPI) : this.getConstructionTypes(wdAPI);
    this.getLocations(wgAndDictionariesAPI);
    let wdHistoryAPI = this.loadHistory(wdAPI);
    let DOMReady$ = Observable.zip(wgAndDictionariesAPI, wdHistoryAPI).delay(2000);
    this.sidenavHelper.DOMComplete(this, DOMReady$);
    this.sidenavService.updateData(this.selectedPage, 0);
  }

  private loadWageDetermination() {
    let wgSubject = new ReplaySubject(1); // broadcasts the opportunity to multiple subscribers
    let apiStream = this.route.params.switchMap(params => { // construct a stream of api data
      this.referenceNumber = params['referencenumber'];
      this.isSCA = this.referenceNumber.indexOf('-') > -1;
      this.revisionNumber = params['revisionnumber'];

      this.revisionMessage = false;
      this.locations = null;
      this.locationDescription = null;
      this.services = null;
      this.servicesArray = [];
      return this.wgService.getWageDeterminationByReferenceNumberAndRevisionNumber(this.referenceNumber, this.revisionNumber);
    });

    this.apiStreamSub = apiStream.subscribe(wgSubject);

    // run whenever api data is updated
    this.apiSubjectSub = wgSubject.subscribe(api => { // do something with the wg api
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

      this.sidenavHelper.updateSideNav(this, false, wageDeterminationSideNavContent);
    }, err => {
      this.router.navigate(['/404']);
    });

    return wgSubject;
  }

  selectedItem(item) {
    this.selectedPage = this.sidenavService.getData()[0];
  }


  private loadDictionary() {
    let dictionariesSubject = new ReplaySubject(1);
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('wdStates,wdCounties,scaServices');
    if (filteredDictionaries===''){
      dictionariesSubject.next(filteredDictionaries);
    } else {
      this.dictionaryService.getWageDeterminationDictionary(filteredDictionaries).subscribe(dictionariesSubject);
      dictionariesSubject.subscribe(data => {
        this.dictionariesUpdated = true;
      }, err => {
        console.log('Error loading dictionaries: ', err);
      });
    }

    return dictionariesSubject;
  }


  sidenavPathEvtHandler(data) {
    this.sidenavHelper.sidenavPathEvtHandler(this, data);
  }

  private getLocations(combinedAPI: Observable<any>) {
    combinedAPI.subscribe(([wageDetermination, dictionaries, routeParam]) => {
      //combileLatest has a weird behavior, fix for it
      if (routeParam.revisionnumber == wageDetermination.revisionNumber) {
        /** Check that locations exist **/
        if (!wageDetermination.location || typeof wageDetermination.location === 'undefined') {
          this.locations = null;
          return;
        }

        if(wageDetermination.location.description != 'na'){
          this.locationDescription = wageDetermination.location.description;
          return;
        }

        if(typeof wageDetermination.location !== 'undefined' && typeof wageDetermination.location.mapping !== 'undefined'){
          /** Process each location data into a usable state **/
          for (let eachLocation of wageDetermination.location.mapping) {
            /** Process States **/
            // given a state code, look up the dictionary entry for that state (returns array of matches)
            let filterMultiArrayObjectPipe = new FilterMultiArrayObjectPipe();
            let resultStates = filterMultiArrayObjectPipe.transform([eachLocation.state], this.dictionaryService.dictionaries['wdStates'], 'elementId', false, '');

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
              eachLocation.countiesString = countiesPrefix + this.getCounties(eachLocation.counties, this.dictionaryService.dictionaries['wdCounties']);
            }
          }

          this.locations = wageDetermination.location.mapping;
        }
      }
    });
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
    resultCounties = _.sortBy(resultCounties, 'value');

    // otherwise take the names of all the found counties and join them into a comma separated string
    return resultCounties.map(county => { return county.value }).join(', ') + warning;
  }

  private getServices(combinedAPI: Observable<any>) {
    combinedAPI.subscribe(([wageDetermination, dictionaries, routeParam]) => {
      this.dictionariesUpdated = true;
      //combileLatest has a weird behavior, fix for it
      if (routeParam.revisionnumber == wageDetermination.revisionNumber) {
        if (wageDetermination.services != null) {
          let servicesString = "";

          for (let element of wageDetermination.services) {
            let serviceArray = [];
            let result = this.FilterMultiArrayObjectPipe.transform([element.toString()], this.dictionaryService.dictionaries['scaServices'], 'elementId', false, "");
            let serviceValue = (result instanceof Array && result.length > 0) ? result[0].value : [];
            let serviceDesc = (result instanceof Array && result.length > 0) ? result[0].description : [];
            serviceArray.push(serviceValue, serviceDesc);
            servicesString = servicesString.concat(serviceValue + ", ");
            this.servicesArray.push(serviceArray);
          }
          servicesString = servicesString.substring(0, servicesString.length - 2);
          this.services = servicesString;
        } else {
          this.services = null;
        }
      }
    });
  }

  private getConstructionTypes(wdAPI) {
    wdAPI.subscribe((wageDeterminaton) => {
      if (wageDeterminaton.constructionType != null) {
        let constructionTypeString = "";
        for (let element of wageDeterminaton.constructionType) {
          constructionTypeString = constructionTypeString.concat(element + ", ");
        }
        constructionTypeString = constructionTypeString.substring(0, constructionTypeString.length - 2);
        this.constructionTypes = constructionTypeString;
      } else {
        this.constructionTypes = null;
      }
    })
  }

  private loadHistory(wageDetermination: ReplaySubject<any>) {

    let historySubject = new ReplaySubject(1);
    wageDetermination.subscribe(wageDeterminationAPI => {
      /** Check that wageDetermination reference and revision numbers exist **/
      if (wageDeterminationAPI.fullReferenceNumber === '' || typeof wageDeterminationAPI.fullReferenceNumber === 'undefined' || wageDeterminationAPI.revisionNumber === '' || typeof wageDeterminationAPI.revisionNumber === 'undefined') {
        console.log('Error loading history');
        return;
      }

      /** Load history API **/
      this.wgService.getWageDeterminationHistoryByReferenceNumber(wageDeterminationAPI.fullReferenceNumber).subscribe(historySubject);
      historySubject.subscribe(historyAPI => {
        let processWageDeterminationHistory = new ProcessWageDeterminationHistory();
        let pipedHistory = processWageDeterminationHistory.transform(historyAPI, this.qParams);
        this.processedHistory = pipedHistory.processedHistory;
        this.shortProcessedHistory = pipedHistory.shortProcessedHistory;
        this.longProcessedHistory = pipedHistory.longProcessedHistory;
        //use processedHistory to show Revision Message
        this.showRevisionMessage();
      }, err => {
        console.log('Error loading history: ', err);
      });

    });
    return historySubject;
  }

  private showRevisionMessage() {
    if (this.processedHistory.length > 0 && this.processedHistory[0].index != this.revisionNumber) {
      this.revisionMessage = true;
    }
  }

  private showHideLongHistory() {
    if (this.showingLongHistory == false) {
      this.processedHistory = this.longProcessedHistory;
      this.showingLongHistory = true;
    } else {
      this.processedHistory = this.shortProcessedHistory;
      this.showingLongHistory = false;
    }
  }
}
