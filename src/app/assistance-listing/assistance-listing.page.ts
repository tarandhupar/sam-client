import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { FHService, ProgramService, DictionaryService, HistoricalIndexService } from 'api-kit';
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import * as Cookies from 'js-cookie';

import * as _ from 'lodash';

// Todo: avoid importing all of observable
import { ReplaySubject, Observable, Subscription } from 'rxjs';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing.page.html',
  providers: [
    FHService,
    ProgramService,
    DictionaryService,
    HistoricalIndexService
  ]
})
export class ProgramPage implements OnInit, OnDestroy {
  program: any;
  programID: any;
  federalHierarchy: any;
  relatedProgram: any[] = [];
  currentUrl: string;
  dictionaries: any;
  authorizationIdsGrouped: any[];
  history: any[];
  historicalIndex: any;
  alert: any = [];
  errorOrganization: any;
  public logoUrl: any;
  public logoInfo: any;
  errorLogo: any;
  cookieValue: string;
  isCookie: boolean = false;
  assistanceTypes: any[] = [];
  //SideNav: On load select first item on sidenav component
  selectedPage: number = 0;
  private gotoPage;
  pageRoute: string;
  pageFragment: string;
  sidenavModel = {
    "label": "FAL",
    "children": []
  };

  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;
  private dictionarySub: Subscription;
  private federalHierarchySub: Subscription;
  private historicalIndexSub: Subscription;
  private relatedProgramsSub: Subscription;

  @ViewChild('editModal') editModal;


  constructor(
    private sidenavService: SidenavService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private historicalIndexService: HistoricalIndexService,
    private programService: ProgramService,
    private fhService: FHService,
    private dictionaryService: DictionaryService) {
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
    if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        this.cookieValue = Cookies.get('iPlanetDirectoryPro');
      }
    }
    let programAPISource = this.loadProgram();
    this.loadDictionaries();
    this.loadFederalHierarchy(programAPISource);
    let historicalIndexAPISource = this.loadHistoricalIndex(programAPISource);
    this.loadRelatedPrograms(programAPISource);
    this.loadAssistanceTypes(programAPISource);
    let DOMReady$ = Observable.zip(programAPISource, historicalIndexAPISource).delay(2000);
    this.DOMComplete(DOMReady$);
    this.sidenavService.updateData(this.selectedPage, 0);
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

  selectedItem(item){
    this.selectedPage = this.sidenavService.getData()[0];
  }

  ngOnDestroy() {
    if(this.apiSubjectSub) { this.apiSubjectSub.unsubscribe(); }
    if(this.apiStreamSub) { this.apiStreamSub.unsubscribe(); }
    if(this.dictionarySub) { this.dictionarySub.unsubscribe(); }
    if(this.federalHierarchySub) { this.federalHierarchySub.unsubscribe(); }
    if(this.historicalIndexSub) { this.historicalIndexSub.unsubscribe(); }
    if(this.relatedProgramsSub) { this.relatedProgramsSub.unsubscribe(); }
  }

  /**
   * @return Observable of Program API
   */
  private loadProgram() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.route.params.switchMap(params => { // construct a stream of api data
      this.programID = params['id'];
      this.alert = [];
      this.relatedProgram = [];
      return this.programService.getProgramById(params['id'], this.cookieValue);
    });
    this.apiStreamSub = apiStream.subscribe(apiSubject);

    this.apiSubjectSub = apiSubject.subscribe(api => {
      // run whenever api data is updated
      this.program = api;

      if(!this.program._links.self) {
        this.router.navigate['accessrestricted'];
      }

      this.checkCurrentFY();
      if(this.program.data && this.program.data.authorizations) {
        this.authorizationIdsGrouped = _.values(_.groupBy(this.program.data.authorizations.list, 'authorizationId'));
      }

      this.pageRoute = "programs/" + this.program.id + "/view";
      let falSideNavContent = {
        "label": "Federal Assistance Listing",
        "route": this.pageRoute,
        "children": []
      };
      if(this.program.status.code != 'published') {
        falSideNavContent.children.push({
          "label": "Header Information",
          "field": "#program-information",
        });
      }

      falSideNavContent.children.push.apply(falSideNavContent.children, [{
        "label": "Overview",
        "field": "#overview",
      },
      {
        "label": "Authorizations",
        "field": "#authorizations",
      },
      {
        "label": "Financial Information",
        "field": "#financial-information",
      },
      {
        "label": "Criteria for Applying",
        "field": "#criteria-for-applying",
      },
      {
        "label": "Applying for Assistance",
        "field": "#applying-for-assistance",
      },
      {
        "label": "Compliance Requirements",
        "field": "#compliance-requirements",
      },
      {
        "label": "Contact Information",
        "field": "#contact-information",
      },
      {
        "label": "History",
        "field": "#history",
      }]);

      this.updateSideNav(falSideNavContent);
    }, err => {
      console.log('Error loading program', err);
      if (err.status === 403) {
        this.router.navigate(['/404']);
      }
    });

    return apiSubject;
  }

  /**
   * @return Observable of Dictionary API
   */
  private loadDictionaries() {
    // declare dictionaries to load
    let dictionaries = [
      'program_subject_terms',
      'date_range',
      'match_percent',
      'assistance_type',
      'applicant_types',
      'assistance_usage_types',
      'beneficiary_types',
      'functional_codes',
      'cfr200_requirements'
    ];

    let dictionaryServiceSubject = new ReplaySubject(1); // broadcasts the dictionary data to multiple subscribers
    // construct a stream of dictionary data
    this.dictionarySub = this.dictionaryService.getDictionaryById(dictionaries.join(',')).subscribe(dictionaryServiceSubject);

    var temp: any = {};
    dictionaryServiceSubject.subscribe(res => {
      // run whenever dictionary data is updated
      for (let key in res) {
        temp[key] = res[key]; // store the dictionary
      }
      this.dictionaries = temp;
    });

    return dictionaryServiceSubject;
  }

  private loadFederalHierarchy(apiSource: Observable<any>) {
    let apiSubject = new ReplaySubject(1);

    // construct a stream of federal hierarchy data
    let apiStream = apiSource.switchMap(api => {
      return this.fhService.getOrganizationById(api.data.organizationId, false);
    })  ;

    apiStream.subscribe(apiSubject);

    this.federalHierarchySub = apiSubject.subscribe(res => {
      this.federalHierarchy = res['_embedded'][0]['org'];
      this.fhService.getOrganizationLogo(apiSubject,
        (logoData) => {
          if (logoData != null) {
            this.logoUrl = logoData.logo;
            this.logoInfo = logoData.info;
          } else {
            this.errorLogo = true;
          }
        }, (err) => {
          this.errorLogo = true;
      });
    }, err => {
      console.log('Error loading organization: ', err);
      this.errorOrganization = true;
    });

    return apiSubject;
  }

  private loadHistoricalIndex(apiSource: Observable<any>) {
    // construct a stream of historical index data
    let historicalIndexStream = apiSource.switchMap(api => {
      return this.historicalIndexService.getHistoricalIndexByProgramNumber(api.id, api.data.programNumber);
    });

    this.historicalIndexSub = historicalIndexStream.subscribe(res => {
      // run whenever historical index data is updated
      this.historicalIndex = res._embedded ? res._embedded.historicalIndex : []; // store the historical index
      let pipe = new HistoricalIndexLabelPipe();
      this.history = _.map(this.historicalIndex, function(value){
        return {
          "id": value.id,
          "index": value.index,
          "date": value.fiscalYear,
          "title": pipe.transform(value.actionType),
          "description": value.changeDescription
        }
      });
      this.history = _.sortBy(this.history, ['index']);
    });

    return historicalIndexStream;
  }

  private loadRelatedPrograms(apiSource: Observable<any>) {
    // construct a stream of related programs ids
    let relatedProgramsIdStream = apiSource.switchMap(api => {
      if (api.data.relatedPrograms && api.data.relatedPrograms.length > 0) {
        return Observable.from(api.data.relatedPrograms);
      }
      return Observable.empty<string>(); // if there are no related programs, don't trigger an update
    });

    // construct a stream that contains all related programs from related program ids
    let relatedProgramsStream = relatedProgramsIdStream.flatMap((relatedId: any) => {
      return this.programService.getLatestProgramById(relatedId, this.cookieValue).retryWhen(
        errors => {
          return this.route.params;
        }
      );
    });

    this.relatedProgramsSub = relatedProgramsStream.subscribe((relatedProgram: any) => {
      // run whenever related programs are updated
      if (typeof relatedProgram !== 'undefined') {
        this.relatedProgram.push({ // store the related program
          'programNumber': relatedProgram.data.programNumber,
          'id': relatedProgram.id
        });
      }
    }, error => {
      console.log("loadRelatedPrograms() Error ", error)
    }, () => {
      console.log("loadRelatedPrograms() Completed")
    });

    return relatedProgramsStream;
  }

  private checkCurrentFY() {
    // check if this program has changed in this FY, if not, display an alert
    if ((new Date(this.program.publishedDate)).getFullYear() < new Date().getFullYear()) {
      this.alert.push({'labelname':'not-updated-since', 'config':{ 'type': 'warning', 'title': '', 'description': 'Note: \n\
This Federal Assistance Listing was not updated by the issuing agency in ' +(new Date()).getFullYear()+ '. \n\
Please contact the issuing agency listed under "Contact Information" for more information.' }});
    }
  }

  private loadAssistanceTypes(apiSource: Observable<any>) {
    apiSource.subscribe(api => {
      if(api.data.financial && api.data.financial.obligations && api.data.financial.obligations.length > 0) {
        this.assistanceTypes = _.map(api.data.financial.obligations, 'assistanceType');
      }

      if(api.data.assistanceTypes && api.data.assistanceTypes.length > 0) {
        this.assistanceTypes = _.union(this.assistanceTypes, api.data.assistanceTypes);
      }
    });
  }

  private toTheTop() {
    document.body.scrollTop = 0;
  }
  public canEdit() {
    if(this.program.status && this.program.status.code!='published' && this.program._links['program:update']) {
      return true;
    } else if(this.program._links['program:revise']) {
      return true;
    }
    return false;
  }

  public onEditClick(page: string[]) {
    if(this.program.status && this.program.status.code!='published') {
      this.router.navigate(['/programs', this.programID, 'edit'].concat(page));
    } else {
      this.editModal.openModal();
      this.gotoPage = page;
    }
  }

  public onEditModalSubmit() {
    this.editModal.closeModal();
    this.programService.reviseProgram(this.programID, this.cookieValue).subscribe(res => {
      this.router.navigate(['/programs', JSON.parse(res._body).id, 'edit'].concat(this.gotoPage));
    });
  }
}
