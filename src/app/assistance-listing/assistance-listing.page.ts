import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FHService, ProgramService, DictionaryService, HistoricalIndexService } from 'api-kit';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';
import { FinancialObligationChart } from './assistance-listing.chart';

import * as _ from 'lodash';

// Todo: avoid importing all of observable
import { ReplaySubject, Observable } from "rxjs";

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing.page.html',
  styleUrls: ['assistance-listing.style.css'],
  providers: [
    FHService,
    ProgramService,
    DictionaryService,
    HistoricalIndexService,
    FilterMultiArrayObjectPipe
  ]
})
export class ProgramPage implements OnInit {
  oProgram:any;
  oFederalHierarchy:any;
  federalHierarchyWithParents:any;
  aRelatedProgram:any[] = [];
  currentUrl:string;
  aDictionaries:any = [];
  authorizationIdsGrouped:any[];
  oHistoricalIndex:any;
  aAlert:any = [];

  @ViewChild(FinancialObligationChart) financialChart:FinancialObligationChart;

  constructor(
    private route:ActivatedRoute,
    private location:Location,
    private oHistoricalIndexService: HistoricalIndexService,
    private oProgramService:ProgramService,
    private oFHService:FHService,
    private oDictionaryService:DictionaryService,
    private FilterMultiArrayObjectPipe: FilterMultiArrayObjectPipe) {}

  ngOnInit() {
    this.currentUrl = this.location.path();

    let apiSource = this.loadAPI();

    let dictionaryStream = this.loadDictionaries();
    this.loadChart(dictionaryStream, apiSource);

    this.loadFederalHierarchy(apiSource);
    this.loadHistoricalIndex(apiSource);
    this.loadRelatedPrograms(apiSource);
  }

  private loadAPI() {
    var apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    var apiStream = this.route.params.switchMap(params => { // construct a stream of api data
      return this.oProgramService.getProgramById(params['id']);
    });
    apiStream.subscribe(apiSubject);

    apiSubject.subscribe(api => { // run whenever api data is updated
      this.oProgram = api;
      this.checkCurrentFY();
      this.authorizationIdsGrouped = _.values(_.groupBy(this.oProgram.data.authorizations, 'authorizationId'));
    }, err => {
      console.log('Error logging', err)
    });

    return apiSubject;
  }

  private loadDictionaries() {
    // declare dictionaries to load
    let aDictionaries = [
      'program_subject_terms',
      'date_range',
      'match_percent',
      'assistance_type',
      'applicant_types',
      'assistance_usage_types',
      'beneficiary_types',
      'functional_codes'
    ];

    var dictionaryServiceSubject = new ReplaySubject(1); // broadcasts the dictionary data to multiple subscribers
    // construct a stream of dictionary data
    this.oDictionaryService.getDictionaryById(aDictionaries.join(',')).subscribe(dictionaryServiceSubject);

    dictionaryServiceSubject.subscribe(res => { // run whenever dictionary data is updated
      for (var key in res) {
        this.aDictionaries[key] = res[key]; // store the dictionary
      }
    });

    return dictionaryServiceSubject;
  }

  private loadChart(dictionarySource: Observable<any>, apiSource: Observable<any>) {
    // construct a stream that triggers an update whenever the api or dictionary changes
    var d3UpdateStream = dictionarySource.combineLatest(apiSource, function(dictionary, api) {
      return { dictionary: dictionary, api: api };
    });

    d3UpdateStream.subscribe(updated => { // run whenever underlying d3 chart data is updated
      if (updated.api.data.financial.obligations) {
        // call to this.aDictionaries is safe because d3UpdateStream requires dictionary api to be loaded
        this.financialChart.createVisualization(
          this.financialChart.prepareVisualizationData(updated.api.data.financial.obligations, this.aDictionaries)
        );
      }
    });

    return d3UpdateStream;
  }

  private loadFederalHierarchy(apiSource: Observable<any>) {
    var oid = "";

    var fhWithParentsStream = apiSource.switchMap(api => { // construct a stream of federal hierarchy data
      oid = api.data.organizationId;
      return this.oFHService.getFederalHierarchyById(api.data.organizationId, true, false);
    })  ;

    fhWithParentsStream.subscribe(res => { // run whenever federal hierarchy data is updated
      this.federalHierarchyWithParents = res;
      // search for only the data belonging to this object, without it's parents or children
      this.oFederalHierarchy = this.FilterMultiArrayObjectPipe.transform(
        [oid], [this.federalHierarchyWithParents], "elementId", true, "hierarchy")[0];
    });

    return fhWithParentsStream;
  }

  private loadHistoricalIndex(apiSource: Observable<any>) {
    var historicalIndexStream = apiSource.switchMap(api => { // construct a stream of historical index data
      return this.oHistoricalIndexService.getHistoricalIndexByProgramNumber(api.data._id, api.data.programNumber);
    });

    historicalIndexStream.subscribe(res => { // run whenever historical index data is updated
      this.oHistoricalIndex = res._embedded ? res._embedded.historicalIndex : []; // store the historical index
    });

    return historicalIndexStream;
  }

  private loadRelatedPrograms(apiSource: Observable<any>) {
    var relatedProgramsIdStream = apiSource.switchMap(api => { // construct a stream of related programs ids
      if (api.data.relatedPrograms.flag != "na") {
        return Observable.from(api.data.relatedPrograms.relatedTo);
      }
      return Observable.empty(); // if there are no related programs, don't trigger an update
    });

    // construct a stream that contains all related programs from related program ids
    var relatedProgramsStream = relatedProgramsIdStream.flatMap(relatedId => {
      return this.oProgramService.getLatestProgramById(relatedId);
    });

    relatedProgramsStream.subscribe(relatedProgram => { // run whenever related programs are updated
      if(typeof relatedProgram !== 'undefined') {
        this.aRelatedProgram.push({ // store the related program
          "programNumber": relatedProgram.data.programNumber,
          "id": relatedProgram.data._id
        });
      }
    });

    return relatedProgramsStream;
  }

  private checkCurrentFY() {
    //check if this program has changed in this FY, if not, display an alert
    if ((new Date(this.oProgram.publishedDate)).getFullYear() < new Date().getFullYear()) {
      this.aAlert.push({"labelname":"not-updated-since", "config":{ "type": "warning", "title": "", "description": "Note: \n\
This Federal Assistance Listing was not updated by the issuing agency in "+(new Date()).getFullYear()+". \n\
Please contact the issuing agency listed under \"Contact Information\" for more information." }});
    }
  }
}
