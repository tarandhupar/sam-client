import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { WageDeterminationService } from "api-kit";
import { ReplaySubject, Observable } from "rxjs";
import * as _ from 'lodash';
import { FilterMultiArrayObjectPipe } from "../app-pipes/filter-multi-array-object.pipe";
import { SidenavService } from "sam-ui-elements/src/ui-kit/components/sidenav/services/sidenav.service";


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
    this.getLocations(wgAndDictionariesAPI);
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

        let wageDeterminationSideNavContent = {
          "label": "Wage Determination",
          "route": "wage-determination/"+this.wageDetermination.fullReferenceNumber+"/"+this.wageDetermination.revisionNumber,
          "children": [
            {
              "label": (this.isSCA ? "SCA WD # " : "DBA WD # ") + this.wageDetermination.fullReferenceNumber,
              "field": "wage-determination"
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
    this.wgService.getWageDeterminationDictionary('wdStates, wdCounties, scaServices').subscribe(dictionariesSubject);
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

  private getLocations(combinedAPI: Observable<any>){
    combinedAPI.subscribe(([wageDetermination, dictionaries]) => {
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

  public openDocumentPrintPage() {
    var win = window.open('', 'Document');
    win.document.body.innerHTML = '<pre>' + this.wageDetermination.document + '</pre>';
  }
}
