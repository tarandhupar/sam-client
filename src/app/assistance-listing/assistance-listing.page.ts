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
    this.startD3Updates(dictionaryStream, apiSource);

    this.loadFederalHierarchy(apiSource);
    this.loadHistoricalIndex(apiSource);
    this.loadRelatedPrograms(apiSource);
  }

  private loadAPI() {
    var apiSubject = new ReplaySubject(1);
    var apiStream = this.route.params.switchMap(params => {
      return this.oProgramService.getProgramById(params['id']);
    });
    apiStream.subscribe(apiSubject);

    apiSubject.subscribe(api => {
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

    var dictionaryServiceSubject = new ReplaySubject(1);
    this.oDictionaryService.getDictionaryById(aDictionaries.join(',')).subscribe(dictionaryServiceSubject);

    dictionaryServiceSubject.subscribe(res => {
      for (var key in res) {
        this.aDictionaries[key] = res[key];
      }
    });

    return dictionaryServiceSubject;
  }

  private startD3Updates(dictionarySource: Observable<any>, apiSource: Observable<any>) {
    // Construct a stream that triggers an update whenever the api or dictionary changes
    var d3UpdateStream = dictionarySource.combineLatest(apiSource, function(dictionary, api) {
      return { dictionary: dictionary, api: api };
    });

    d3UpdateStream.subscribe(updated => {
      if (updated.api.data.financial.obligations) {
        this.financialChart.createVisualization(
          this.financialChart.prepareVisualizationData(updated.api.data.financial.obligations, this.aDictionaries)
        );
      }
    });

    return d3UpdateStream;
  }

  private loadFederalHierarchy(apiSource: Observable<any>) {
    var oid = "";

    var fhWithParentsStream = apiSource.switchMap(api => {
      oid = api.data.organizationId;
      return this.oFHService.getFederalHierarchyById(api.data.organizationId, true, false);
    })  ;

    fhWithParentsStream.subscribe(res => {
      this.federalHierarchyWithParents = res;
      this.oFederalHierarchy = this.FilterMultiArrayObjectPipe.transform(
        [oid], [this.federalHierarchyWithParents], "elementId", true, "hierarchy")[0];
    });

    return fhWithParentsStream;
  }

  private loadHistoricalIndex(apiSource: Observable<any>) {
    var historicalIndexStream = apiSource.switchMap(api => {
      return this.oHistoricalIndexService.getHistoricalIndexByProgramNumber(api.data._id, api.data.programNumber);
    });

    historicalIndexStream.subscribe(res => {
      this.oHistoricalIndex = res._embedded ? res._embedded.historicalIndex : [];
    });

    return historicalIndexStream;
  }

  private loadRelatedPrograms(apiSource: Observable<any>) {
    var relatedProgramsIdStream = apiSource.switchMap(api => {
      if (api.data.relatedPrograms.flag != "na") {
        return Observable.from(api.data.relatedPrograms.relatedTo);
      }
      return Observable.empty();
    });

    var relatedProgramsStream = relatedProgramsIdStream.flatMap(relatedId => {
      return this.oProgramService.getLatestProgramById(relatedId);
    });

    relatedProgramsStream.subscribe(relatedProgram => {
      if(typeof relatedProgram !== 'undefined') {
        this.aRelatedProgram.push({
          "programNumber": relatedProgram.data.programNumber,
          "id": relatedProgram.data._id
        });
      }
    });

    return relatedProgramsStream;
  }

  // TODO - refactor alert
  private checkCurrentFY() {
    //check if this program has changed in this FY
    if ((new Date(this.oProgram.publishedDate)).getFullYear() < new Date().getFullYear()) {
      this.aAlert.push({"labelname":"not-updated-since", "config":{ "type": "warning", "title": "", "description": "Note: \n\
This Federal Assistance Listing was not updated by the issuing agency in "+(new Date()).getFullYear()+". \n\
Please contact the issuing agency listed under \"Contact Information\" for more information." }});
    }
  }
}
