import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { FHService, ProgramService, DictionaryService, HistoricalIndexService } from 'api-kit';
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

  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;
  private dictionarySub: Subscription;
  private federalHierarchySub: Subscription;
  private historicalIndexSub: Subscription;
  private relatedProgramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private historicalIndexService: HistoricalIndexService,
    private programService: ProgramService,
    private fhService: FHService,
    private dictionaryService: DictionaryService) {}

  ngOnInit() {
    console.log("Related Programs: ", this.relatedProgram);
    // Using document.location.href instead of
    // location.path because of ie9 bug
    this.currentUrl = document.location.href;
    if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        this.cookieValue = Cookies.get('iPlanetDirectoryPro');
      }
    }
    console.log("ngOnInit 1");
    let programAPISource = this.loadProgram();
    console.log("ngOnInit 2");
    this.loadDictionaries();
    console.log("ngOnInit 3");
    this.loadFederalHierarchy(programAPISource);
    console.log("ngOnInit 4");
    this.loadHistoricalIndex(programAPISource);
    console.log("ngOnInit 5");
    this.loadRelatedPrograms(programAPISource);
    console.log("ngOnInit 6");
    this.loadAssistanceTypes(programAPISource);
    console.log("ngOnInit 7");
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
    console.log("loadProgram() before api");
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
      console.log("program is loaded: ", api);
      this.program = api;
      this.checkCurrentFY();
      if(this.program.data && this.program.data.authorizations) {
        this.authorizationIdsGrouped = _.values(_.groupBy(this.program.data.authorizations.list, 'authorizationId'));
      }
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
    console.log("loadDictionaries() before api");
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
      console.log("loadDictionaries() after api");
      // run whenever dictionary data is updated
      for (let key in res) {
        temp[key] = res[key]; // store the dictionary
      }
      this.dictionaries = temp;
    });

    return dictionaryServiceSubject;
  }

  private loadFederalHierarchy(apiSource: Observable<any>) {
    console.log("loadFederalHierarchy() before api");
    let apiSubject = new ReplaySubject(1);

    // construct a stream of federal hierarchy data
    let apiStream = apiSource.switchMap(api => {
      console.log("loadFederalHierarchy() after api1");
      return this.fhService.getOrganizationById(api.data.organizationId, false);
    })  ;

    apiStream.subscribe(apiSubject);

    this.federalHierarchySub = apiSubject.subscribe(res => {
      console.log("loadFederalHierarchy() after api2");
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
    console.log("loadHistoricalIndex() before api");
    // construct a stream of historical index data
    let historicalIndexStream = apiSource.switchMap(api => {
      console.log("loadHistoricalIndex() after api1");
      return this.historicalIndexService.getHistoricalIndexByProgramNumber(api.id, api.data.programNumber);
    });

    this.historicalIndexSub = historicalIndexStream.subscribe(res => {
      console.log("loadHistoricalIndex() after api2");
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
    console.log("loadRelatedPrograms() before api");
    // construct a stream of related programs ids
    let relatedProgramsIdStream = apiSource.switchMap(api => {
      console.log("loadRelatedPrograms() after api1: ", api);
      if (api.data.relatedPrograms && api.data.relatedPrograms.length > 0) {
        return Observable.from(api.data.relatedPrograms);
      }
      return Observable.empty<string>(); // if there are no related programs, don't trigger an update
    });

    // construct a stream that contains all related programs from related program ids
    let relatedProgramsStream = relatedProgramsIdStream.flatMap((relatedId: any) => {
      console.log("Related Id: ", relatedId);
      return this.programService.getLatestProgramById(relatedId, this.cookieValue);
    });

    this.relatedProgramsSub = Observable.onErrorResumeNext(relatedProgramsStream).subscribe((relatedProgram: any) => {
      console.log("loadRelatedPrograms() after api2: ", relatedProgram);
      // run whenever related programs are updated
      if (typeof relatedProgram !== 'undefined') {
        this.relatedProgram.push({ // store the related program
          'programNumber': relatedProgram.data.programNumber,
          'id': relatedProgram.id
        });
      }
    }, error => {
      console.log("loadRelatedPrograms() after api2: error ", error)
    }, () => {
      console.log("loadRelatedPrograms() after api3: completed")
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
    console.log("loadAssistanceTypes() after api1")
    apiSource.subscribe(api => {
      console.log("loadAssistanceTypes() after api2")
      if(api.data.financial && api.data.financial.obligations && api.data.financial.obligations.length > 0) {
        this.assistanceTypes = _.map(api.data.financial.obligations, 'assistanceType');
      }

      if(api.data.assistanceTypes && api.data.assistanceTypes.length > 0) {
        this.assistanceTypes = _.union(this.assistanceTypes, api.data.assistanceTypes);
      }
    });
  }

  private updateRelatedProgram(){
    this.relatedProgram = [];
  }
}
