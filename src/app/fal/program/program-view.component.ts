import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {FHService} from '../services/fh.service';
import {ProgramService} from '../services/program.service';
import { Subscription } from 'rxjs/Subscription';
import {DictionaryService} from '../services/dictionary.service';
import {HistoricalIndexService} from '../services/historical-index.service';
import * as _ from 'lodash';


@Component({
  moduleId: __filename,
  templateUrl: 'program-view.component.html',
  styleUrls: ['program-view.style.css'],
  providers: [FHService, ProgramService, DictionaryService, HistoricalIndexService]
})
export class ProgramViewComponent implements OnInit {
  oProgram:any;
  oFederalHierarchy:any;
  aRelatedProgram:any[] = [];
  currentUrl:string;
  aDictionaries:any = {};
  authorizationIdsGrouped:any[];
  oHistoricalIndex:any;

  private sub:Subscription;

  constructor(private route:ActivatedRoute, private location:Location, private oHistoricalIndexService: HistoricalIndexService,
              private oProgramService:ProgramService, private oFHService:FHService, private oDictionaryService:DictionaryService) {
    this.currentUrl = location.path();

    //init Dictionaries
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

    oDictionaryService.getDictionaryById(aDictionaries.join(',')).subscribe(res => {
      for (var key in res) {
        this.aDictionaries[key] = res[key];
      }
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id']; //id will be a string, not a number
      this.oProgramService.getProgramById(id).subscribe(res => {
          this.oProgram = res;
          //get authorizations and group them by id
          var auths = this.oProgram.program.data.authorizations;
          this.authorizationIdsGrouped = _.values(_.groupBy(auths, 'authorizationId'));
          this.oFHService.getFederalHierarchyById(res.program.data.organizationId,false,false)
            .subscribe(res => {
              this.oFederalHierarchy = res;
            });
          this.oHistoricalIndexService.getHistoricalIndexByProgramNumber(id, this.oProgram.program.data.programNumber)
            .subscribe(res => {
              this.oHistoricalIndex = res;
          });
          if (this.oProgram.program.data.relatedPrograms.flag != "na") {
            for (let programId of this.oProgram.program.data.relatedPrograms.relatedTo) {
              this.oProgramService.getProgramById(programId).subscribe(relatedFal => {
                this.aRelatedProgram.push({"programNumber": relatedFal.program.data.programNumber, "id": relatedFal.program.data._id})
              })
            }
          }
        },
          err => {
          console.log('Error logging', err)
        },
        () => {
          console.log('Api CALL Completed')
        }
      );

    });
  }

}
