import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {FALFormService} from "../../fal-form.service";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";
import * as moment from 'moment';
import { FALAssistSubFormComponent } from '../../../components/applying-assistance-subform/applying-assistance-subform.component';
import { falCustomValidatorsComponent } from "../../../validators/assistance-listing-validators";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-assistance',
  templateUrl: 'fal-form-applying-assistance.template.html'
})

export class FALAssistanceComponent implements OnInit {

  @ViewChild('assistSubForm') assistSubForm:FALAssistSubFormComponent;
  @Input() viewModel: FALFormViewModel;
  @Output() public onError = new EventEmitter();

  progTitle: string;
  hideAddButton: boolean = false;
  assistInfoDisp: any = [];
  falAssistanceForm: FormGroup;
  formErrorArr = [];
  review:boolean = false;

  public deadlinesFlagOptions = [];
  public dateRangeOptions = [{ label: 'None Selected', value: 'na'}];

  public preAppCordOptions = [
    { label: 'An environmental impact statement is required for this program.', value: 'statement' },
    { label: 'An environmental impact assessment is required for this program.', value: 'assessment'},
    { label: 'Executive Order 12372, "Intergovernmental Review of Federal Programs," applies to this listing.', value: 'ExecutiveOrder12372'},
    { label: 'Other pre-application coordination is required.', value: 'otherRequired' }
  ];

  public appProcOptions = [{ label: 'Funding contract opportunities notices for this listing will be posted on Grants.gov', value: true }];

  public selectionCriteriaOptions = [{ label: 'There are criteria for selection proposals.', value: true }];

  constructor(private fb: FormBuilder, private service: FALFormService) {}

  ngOnInit(){

    this.setDictOptions();
    this.createForm();

    this.falAssistanceForm.valueChanges.subscribe(data => this.updateViewModel(data));
    this.falAssistanceForm.get('preApplicationCoordination').get('reports').valueChanges.subscribe(data => {
      if(data.indexOf('otherRequired') !== -1) {
        this.falAssistanceForm.get('preApplicationCoordination').get('description').setValidators(Validators.required);
        this.checkControlforErrors(this.falAssistanceForm.controls['preApplicationCoordination']['controls']['description'], 'preApplicationCoordination-description');
      } else {
        this.falAssistanceForm.get('preApplicationCoordination').get('description').setValidators(null);
      }
    });

    this.falAssistanceForm.get('selectionCriteria').get('isApplicable').valueChanges.subscribe(data => {
      if(data.length > 0){
        this.falAssistanceForm.get('selectionCriteria').get('description').setValidators(Validators.required);
        this.checkControlforErrors(this.falAssistanceForm.controls['selectionCriteria']['controls']['description'], 'selectionCriteria-description');
      }
      else {
        this.falAssistanceForm.get('selectionCriteria').get('description').setValidators(null);
      }
    });

    this.assistSubForm.falAssistSubForm.valueChanges.subscribe(data => this.updateDeadlineViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();

      setTimeout(() => {
        this.collectErrors();
      }, 30);
    }
  }

  setDictOptions(){
    this.service.getAssistanceDict().subscribe(data => {
        for(let flag of data['deadline_flag']){
          this.deadlinesFlagOptions.push({label:flag.value, value:flag.code});
        }

        for(let dr of data['date_range']){
          this.dateRangeOptions.push({ label: dr.value, value:dr.code });
        }
      },
      error => {
        console.error('error retrieving deadline flag options', error);
      });

  }

  createForm(){
    this.falAssistanceForm = this.fb.group({
      deadlines: this.fb.group({
        flag: ['', falCustomValidatorsComponent.radioButtonRequired],
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
        interval: ['na', falCustomValidatorsComponent.selectRequired],
        description: ''
      }),
      appeal: this.fb.group({
        interval: ['na', falCustomValidatorsComponent.selectRequired],
        description: ''
      }),
      renewal: this.fb.group({
        interval: ['na', falCustomValidatorsComponent.selectRequired],
        description: ''
      })
    });
  }

  updateDeadlineViewModel(data){
    this.viewModel.deadlineList = data.deadlineList;
  }

  updateViewModel(data) {
    //get reports
    let reports = [];
    for(let report of data.preApplicationCoordination.reports){

      reports.push( {
        reportCode: report,
        isSelected: true
      } );
    }

    this.viewModel.deadlineFlag = data.deadlines.flag || null;
    this.viewModel.deadlineDesc = data.deadlines.description || null;
    this.viewModel.preAppCoordReports = reports;
    this.viewModel.preAppCoordDesc = data.preApplicationCoordination.description || null;
    this.viewModel.appProcIsApp = data.applicationProcedure.isApplicable[0] || null;
    this.viewModel.appProcDesc = data.applicationProcedure.description || null;
    this.viewModel.selCriteriaIsApp = data.selectionCriteria.isApplicable[0] || null;
    this.viewModel.selCriteriaDesc = data.selectionCriteria.description || null;
    this.viewModel.awardProcDesc = data.awardProcedure.description || null;
    this.viewModel.approvalInterval = (data.approval.interval == 'na' ? null : data.approval.interval);
    this.viewModel.approvalDesc = data.approval.description || null;
    this.viewModel.appealInterval = (data.appeal.interval == 'na' ? null : data.appeal.interval);
    this.viewModel.appealDesc = data.appeal.description || null;
    this.viewModel.renewalInterval = (data.renewal.interval == 'na' ? null : data.renewal.interval);
    this.viewModel.renewalDesc = data.renewal.description || null;

    this.collectErrors();
  }

  updateForm() {

    //title
    this.progTitle = this.viewModel.title;

    //report
    let reports = this.viewModel.preAppCoordReports;
    let reportArr = [];
    for(let report of reports){
      reportArr.push(report.reportCode);
    }

    //deadline list
    if(this.viewModel.deadlineList.length > 0){
      this.assistSubForm.assistInfo = this.viewModel.deadlineList;
      let index = 0;
      for(let assist of this.assistSubForm.assistInfo){
        const control = <FormArray> this.assistSubForm.falAssistSubForm.controls['deadlineList'];
        control.push(this.assistSubForm.initAssist());
        control.at(index).patchValue(assist);
        index = index + 1;
      }

      this.formatAssistInfo(this.assistSubForm.assistInfo);
    }

    this.falAssistanceForm.patchValue({
     deadlines:{
      flag: this.viewModel.deadlineFlag,
      description: this.viewModel.deadlineDesc
     },
     preApplicationCoordination:{
      reports: reportArr,
      description: this.viewModel.preAppCoordDesc
     },
     applicationProcedure:{
      isApplicable: ( this.viewModel.appProcIsApp == false ? [] : [this.viewModel.appProcIsApp]),
      description: this.viewModel.appProcDesc
     },
     selectionCriteria: {
      isApplicable: (this.viewModel.selCriteriaIsApp == false ? [] : [this.viewModel.selCriteriaIsApp]),
      description: this.viewModel.selCriteriaDesc
     },
     awardProcedure: {
      description: this.viewModel.awardProcDesc
     },
     approval: {
      interval: this.viewModel.approvalInterval,
      description: this.viewModel.approvalDesc
     },
     appeal: {
      interval: this.viewModel.appealInterval,
      description: this.viewModel.appealDesc
     },
     renewal: {
      interval:  this.viewModel.renewalInterval,
      description:  this.viewModel.renewalDesc
     }
     }, {
      emitEvent: false
    });

  }

  assistActionHandler(event){
    if(event.type == 'add'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'confirm'){
      this.hideAddButton = event.hideAddButton;
      this.formatAssistInfo(event.assistInfo);
    }
    if(event.type == 'cancel'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'edit'){
      this.editAssist(event.index);
    }
    if(event.type == 'remove'){
      this.removeAssist(event.index);
    }
  }

  editAssist(i: number){
    this.assistSubForm.editAssist(i);
    this.hideAddButton = this.assistSubForm.hideAddButton;
  }

  removeAssist(i: number){
    this.assistSubForm.removeAssist(i);
    this.formatAssistInfo(this.assistSubForm.assistInfo);
    this.hideAddButton = this.assistSubForm.hideAddButton;
  }

  formatAssistInfo(assistInfo){
    this.assistInfoDisp = [];
    for(let assist of assistInfo) {

      let startDate = moment(assist.start).format('MMMM DD, YYYY');
      let endDate = moment(assist.end).format('MMMM DD, YYYY');

      let label = '';

      if (assist.start || assist.end) {
        if (assist.start && assist.end) { // when both start and end exists
          label = startDate + ' - ' + endDate;
        }

        else { // when only one of start and end exists
          if (assist.start) {
            label = startDate;
          }
          if (assist.end) {
            label = endDate;
          }
        }

        label += '. ';
      }

      if(assist.description) {
        label += assist.description;
      }

      this.assistInfoDisp.push(label);
    }
  }

  public validateSection() {

    this.review = true;

    //mark all controls as dirty
    for (let control in this.falAssistanceForm.controls) {
      this.falAssistanceForm.controls[control].markAsDirty();
      this.falAssistanceForm.controls[control].updateValueAndValidity();

      for (let subControl in this.falAssistanceForm.controls[control]['controls']) {
        this.falAssistanceForm.controls[control]['controls'][subControl].markAsDirty();
        this.falAssistanceForm.controls[control]['controls'][subControl].updateValueAndValidity();
      }
    }

    if(this.formErrorArr.length > 0)
      this.emitEvent();
  }

  collectErrors(){

    for (let key of Object.keys(this.falAssistanceForm.controls)) {
      this.checkControlforErrors(this.falAssistanceForm.controls[key], key);

      for (let subKey of Object.keys(this.falAssistanceForm.controls[key]['controls'])) {
        this.checkControlforErrors(this.falAssistanceForm.controls[key]['controls'][subKey], key + '-' + subKey);
      }
    }
  }

  checkControlforErrors(control, key){

    let len = this.formErrorArr.length;
    let index = this.formErrorArr.indexOf(key);

    if(control.errors){
      if(index == -1) {
        this.formErrorArr.push(key);
      }
    }
    else {
      if(index > -1) {
        this.formErrorArr.splice(index, 1);
      }
    }

    if(len !== this.formErrorArr.length && this.review){
      this.emitEvent();
    }
  }

  emitEvent(){

    this.onError.emit({
      formErrorArr: this.formErrorArr,
      section: 'applying-for-assistance'
    });
  }
}
