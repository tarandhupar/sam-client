import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FHService, ProgramService, DictionaryService, HistoricalIndexService } from 'api-kit';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';

import * as _ from 'lodash';

// Todo: avoid importing all of observable
import { ReplaySubject, Observable } from 'rxjs';

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
  program: any;
  federalHierarchy: any;
  federalHierarchyWithParents: any;
  relatedProgram: any[] = [];
  currentUrl: string;
  dictionaries: any;
  authorizationIdsGrouped: any[];
  historicalIndex: any;
  alert: any = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private historicalIndexService: HistoricalIndexService,
    private programService: ProgramService,
    private fhService: FHService,
    private dictionaryService: DictionaryService,
    private filterMultiArrayObjectPipe: FilterMultiArrayObjectPipe) {}

  ngOnInit() {
    this.currentUrl = this.location.path();

    let programAPISource = this.loadProgram();

    this.loadDictionaries();
    this.loadFederalHierarchy(programAPISource);
    this.loadHistoricalIndex(programAPISource);
    this.loadRelatedPrograms(programAPISource);
  }

  /**
   * @return Observable of Program API 
   */
  private loadProgram() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.route.params.switchMap(params => { // construct a stream of api data
      return this.programService.getProgramById(params['id']);
    });
    apiStream.subscribe(apiSubject);

    apiSubject.subscribe(api => { // run whenever api data is updated
      this.program = api;
      this.checkCurrentFY();
      this.authorizationIdsGrouped = _.values(_.groupBy(this.program.data.authorizations, 'authorizationId'));
    }, err => {
      console.log('Error logging', err);
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
      'functional_codes'
    ];

    let dictionaryServiceSubject = new ReplaySubject(1); // broadcasts the dictionary data to multiple subscribers
    // construct a stream of dictionary data
    this.dictionaryService.getDictionaryById(dictionaries.join(',')).subscribe(dictionaryServiceSubject);

    var temp: any = {};
    dictionaryServiceSubject.subscribe(res => { // run whenever dictionary data is updated
      for (let key in res) {
        temp[key] = res[key]; // store the dictionary
      }
      this.dictionaries = temp;
    });

    return dictionaryServiceSubject;
  }

  private loadFederalHierarchy(apiSource: Observable<any>) {
    let oid = '';

    let fhWithParentsStream = apiSource.switchMap(api => { // construct a stream of federal hierarchy data
      oid = api.data.organizationId;
      return this.fhService.getFederalHierarchyById(api.data.organizationId, true, false);
    })  ;

    fhWithParentsStream.subscribe(res => { // run whenever federal hierarchy data is updated
      this.federalHierarchyWithParents = res;
      // search for only the data belonging to this object, without it's parents or children
      this.federalHierarchy = this.filterMultiArrayObjectPipe.transform(
        [oid], [this.federalHierarchyWithParents], 'elementId', true, 'hierarchy')[0];
    });

    return fhWithParentsStream;
  }

  private loadHistoricalIndex(apiSource: Observable<any>) {
    let historicalIndexStream = apiSource.switchMap(api => { // construct a stream of historical index data
      return this.historicalIndexService.getHistoricalIndexByProgramNumber(api.data._id, api.data.programNumber);
    });

    historicalIndexStream.subscribe(res => { // run whenever historical index data is updated
      this.historicalIndex = res._embedded ? res._embedded.historicalIndex : []; // store the historical index
    });

    return historicalIndexStream;
  }

  private loadRelatedPrograms(apiSource: Observable<any>) {
    let relatedProgramsIdStream = apiSource.switchMap(api => { // construct a stream of related programs ids
      if (api.data.relatedPrograms.flag !== 'na') {
        return Observable.from(api.data.relatedPrograms.relatedTo);
      }
      return Observable.empty(); // if there are no related programs, don't trigger an update
    });

    // construct a stream that contains all related programs from related program ids
    let relatedProgramsStream = relatedProgramsIdStream.flatMap(relatedId => {
      return this.programService.getLatestProgramById(relatedId);
    });

    relatedProgramsStream.subscribe(relatedProgram => { // run whenever related programs are updated
      if(typeof relatedProgram !== 'undefined') {
        this.relatedProgram.push({ // store the related program
          'programNumber': relatedProgram.data.programNumber,
          'id': relatedProgram.data._id
        });
      }
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
}
