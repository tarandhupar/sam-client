import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { Router} from '@angular/router';
import { DictionaryService } from 'api-kit';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';

@Component({
  providers: [ ProgramService, DictionaryService ],
  templateUrl: 'applying-for-assistance.template.html',
})

export class FALAssistanceComponent implements OnInit, OnDestroy {

  getProgSub: any;
  saveProgSub: any;
  dictSubDeadlineFlag: any;
  dictSubDateRange: any;
  programId : any;
  progTitle: string;
  hideAddButton: boolean = false;
  redirectToViewPg: boolean = false;
  redirectToWksp: boolean = false;
  falAssistanceForm: FormGroup;

  public deadlinesFlagOptions = [];
  public dateRangeOptions = [{ label: 'None Selected', value: 'na'}];

  public preAppCordOptions = [
    { label: 'An environmental impact statement is required for this program.', value: 'statement' },
    { label: 'An environmental impact assessment is required for this program.', value: 'assessment'},
    { label: 'Executive Order 12372, "Intergovernmental Review of Federal Programs," applies to this listing.', value: 'ExecutiveOrder12372'}
    ];

  public appProcOptions = [{ label: 'Funding opportunities notices for this listing will be posted on Grants.gov', value: true}];

  public selectionCriteriaOptions = [{ label: 'There are criteria for selection proposals.', value: true }];


  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService,
              private dictService: DictionaryService){

    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;

    this.dictSubDeadlineFlag = dictService.getDictionaryById('deadline_flag')
      .subscribe(data => {
        for(let flag of data['deadline_flag']){
          this.deadlinesFlagOptions.push({label:flag.value, value:flag.code});
        }
    });

    this.dictSubDateRange = dictService.getDictionaryById('date_range')
      .subscribe(data => {
        for(let dr of data['date_range']){
          this.dateRangeOptions.push({ label: dr.value, value:dr.code });
        }
      });
  }

  ngOnInit(){
    this.createForm();

    if (this.sharedService.programId) {
      this.getData();
    }
  }

  ngOnDestroy(){
    if(this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if(this.getProgSub)
      this.getProgSub.unsubscribe();

    if(this.dictSubDeadlineFlag)
      this.dictSubDeadlineFlag.unsubscribe();

    if(this.dictSubDateRange)
      this.dictSubDateRange.unsubscribe();
  }

  createForm(){
    this.falAssistanceForm = this.fb.group({
      deadlines: this.fb.group({
        flag: '',
        description: ''
      }),
      preApplicationCoordination: this.fb.group({
        reports: '',
        description: ''
      }),
      applicationProcedure: this.fb.group({
        isApplicable: '',
        description: ''
      }),
      selectionCriteria: this.fb.group({
        isApplicable: '',
        description: ''
      }),
      awardProcedure: this.fb.group({
        description: ''
      }),
      approval: this.fb.group({
        interval: 'na',
        description: ''
      }),
      appeal: this.fb.group({
        interval: 'na',
        description: ''
      }),
      renewal: this.fb.group({
        interval: 'na',
        description: ''
      }),
    });
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          this.progTitle = api.data.title;
          let flag = (api.data.assistance.deadlines.flag ? api.data.assistance.deadlines.flag : '');
          let deadline_desc = (api.data.assistance.deadlines.description ? api.data.assistance.deadlines.description : '');
          let reports = [];

          if(api.data.assistance.preApplicationCoordination.environmentalImpact){
            for(let report of api.data.assistance.preApplicationCoordination.environmentalImpact.reports){
              reports.push(report.reportCode);
            }
          }

          this.falAssistanceForm.patchValue({
            deadlines:{
              flag: flag,
              description: deadline_desc
            },
            preApplicationCoordination:{
              reports: reports
            }
          });
          console.log("api", api);
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  saveData(){

    let data = this.buildData();

    console.log("data", data);

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Applying for Assistance Section', api);

          if(this.redirectToWksp)
            this.router.navigate(['falworkspace']);
          else
            this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/compliance-requirements']);

        },
        error => {
          console.error('Error saving Program!!', error);
        }); //end of subscribe
  }

  buildData(){
    let data = {assistance: JSON.parse(JSON.stringify(this.falAssistanceForm.value))};
    let reports = [];

    for(let report of this.falAssistanceForm.value.preApplicationCoordination.reports){

      reports.push( {
        reportCode: report,
        isSelected: true
      } );
    }

    data.assistance.preApplicationCoordination['environmentalImpact'] = { reports: reports};
    delete data.assistance.preApplicationCoordination['reports'];

    if(data.assistance.renewal.interval == 'na'){
      data.assistance.renewal.interval = '';
    }

    if(data.assistance.appeal.interval == 'na'){
      data.assistance.appeal.interval = '';
    }

    if(data.assistance.approval.interval == 'na'){
      data.assistance.approval.interval = '';
    }

    if(data.assistance.applicationProcedure.isApplicable.length > 0)
      data.assistance.applicationProcedure.isApplicable = true;
    else
      data.assistance.applicationProcedure.isApplicable = false;

    if(data.assistance.selectionCriteria.isApplicable.length > 0)
      data.assistance.selectionCriteria.isApplicable = true;
    else
      data.assistance.selectionCriteria.isApplicable = false;

    return data;
  }

  onSaveContinueClick(){
    this.saveData();
  }

  onCancelClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['/programs', this.sharedService.programId, 'view']);
    else
      this.router.navigate(['/falworkspace']);
  }

  onPreviousClick(event){
    if(this.sharedService.programId)
      this.router.navigate(['programs/' + this.sharedService.programId + '/edit/criteria-information']);
    else
      this.router.navigate(['programs/add/criteria-information']);

  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }
}
