import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {FALFormService} from "../../fal-form.service";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";
import * as moment from 'moment';
import { FALAssistSubFormComponent } from '../../../components/applying-assistance-subform/applying-assistance-subform.component';
import { falCustomValidatorsComponent } from "../../../validators/assistance-listing-validators";
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALSectionNames } from '../../fal-form.constants';

@Component({
  providers: [FALFormService],
  selector: 'fal-form-assistance',
  templateUrl: 'fal-form-applying-assistance.template.html'
})

export class FALAssistanceComponent implements OnInit {

  @ViewChild('assistSubForm') assistSubForm:FALAssistSubFormComponent;
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();

  progTitle: string;
  hideAddButton: boolean = false;
  assistInfoDisp: any = [];
  falAssistanceForm: FormGroup;

  deadlineHint:string =`<p>By what date(s) or between what dates must an application be received by the Federal agency? If the deadline for submission of application is not available, a statement such as the following should be entered: Contact the headquarters (or regional office, as appropriate) for application deadlines. Where this information is not available, agencies should inform GSA as soon as possible after it becomes available. The phrase "See the Federal Register for deadline dates" is not sufficient. 
                        Specific dates must be given. If there are no deadlines, select "None."</p>`;
  addDeadlineHint: string = `List all deadlines in the application process. Enter each deadline separately.`;
  appProcedureHint:string = `For eligible applicants (including intermediate levels), identified under the Applicant Eligibility section,
                          what are the basic procedural steps required by the Federal agency in the application process, beginning with the lowest level and ending eventually with the Federal government?
                          Do OMB Circular No. A-102 or A-100 Apply? Are there any Other Application Procedures?`;
  awardProcedureHint:string = `<p>Describe how assistance is awarded. Include who approves the award and how assistance is distributed.</p>
                               <p>Give the basic procedural steps for awarding assistance beginning with the organizational components of the Federal agency that has final approval authority for the application and end with the lowest level at which Federal resources are expended. 
                               State if the assistance passes through the initial applicant for further distribution to other groups in the private sector. 
                               These steps should be consistent with the steps identified in the Application Procedure subsection above.</p>`;
  approvalHint:string = `<p>Select the range that best represents how much time the approval process takes.</p>
                         <p>In terms of days, what is a representative range of the time required for the application or request to be approved or disapproved. 
                         If, in the case of certain nonfinancial assistance programs this is not relevant, select "Not applicable."</p>`;

  renewalHint:string = `<p>Select the range that best represents when an awardee may apply for a renewal or extension.</p>
                        <p>Are renewals or extensions available? What are the procedures for such? If there are no renewals, enter "None." 
                        If this does not apply to a particular program, select "Not applicable." Describe any additional information necessary.</p>`;

  appealsHint:string = `<p>Select the range that best represents how long an applicant has to appeal a decision.</p>
                        <p>For applications not approved, what appeal procedure and/or allowable rework time is available? If there is no appeal or rework time, select "None." 
                        If this does not apply to the particular program, select "Not applicable." Describe any additional information necessary.</p>`;


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

  constructor(private fb: FormBuilder, private service: FALFormService, private errorService: FALFormErrorService) {}

  ngOnInit(){

    this.setDictOptions();
    this.createForm();

    this.falAssistanceForm.valueChanges.subscribe(data => this.updateViewModel(data));

    this.falAssistanceForm.get('preApplicationCoordination').get('reports').valueChanges.subscribe(data => {
      if(data.indexOf('otherRequired') !== -1) {
        this.falAssistanceForm.get('preApplicationCoordination').get('description').setValidators(Validators.required);
      } else {
        this.falAssistanceForm.get('preApplicationCoordination').get('description').setValidators(null);
      }
    });

    this.falAssistanceForm.get('selectionCriteria').get('isApplicable').valueChanges.subscribe(data => {
      if(data.length > 0){
        this.falAssistanceForm.get('selectionCriteria').get('description').setValidators(Validators.required);
      }
      else {
        this.falAssistanceForm.get('selectionCriteria').get('description').setValidators(null);
      }
    });

    this.assistSubForm.falAssistSubForm.valueChanges.subscribe(data => this.updateDeadlineViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();
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

    setTimeout(() => { // horrible hack to trigger angular change detection
      if (this.viewModel.getSectionStatus(FALSectionNames.APPLYING_FOR_ASSISTANCE) === 'updated') {
        // todo: find way to shorten this...
        this.falAssistanceForm.get('deadlines').get('flag').markAsDirty();
        this.falAssistanceForm.get('deadlines').get('flag').updateValueAndValidity();
        this.falAssistanceForm.get('deadlines').get('description').markAsDirty();
        this.falAssistanceForm.get('deadlines').get('description').updateValueAndValidity();
        this.falAssistanceForm.get('preApplicationCoordination').get('reports').markAsDirty();
        this.falAssistanceForm.get('preApplicationCoordination').get('reports').updateValueAndValidity();
        this.falAssistanceForm.get('preApplicationCoordination').get('description').markAsDirty();
        this.falAssistanceForm.get('preApplicationCoordination').get('description').updateValueAndValidity();
        this.falAssistanceForm.get('applicationProcedure').get('isApplicable').markAsDirty();
        this.falAssistanceForm.get('applicationProcedure').get('isApplicable').updateValueAndValidity();
        this.falAssistanceForm.get('applicationProcedure').get('description').markAsDirty();
        this.falAssistanceForm.get('applicationProcedure').get('description').updateValueAndValidity();
        this.falAssistanceForm.get('selectionCriteria').get('isApplicable').markAsDirty();
        this.falAssistanceForm.get('selectionCriteria').get('isApplicable').updateValueAndValidity();
        this.falAssistanceForm.get('selectionCriteria').get('description').markAsDirty();
        this.falAssistanceForm.get('selectionCriteria').get('description').updateValueAndValidity();
        this.falAssistanceForm.get('awardProcedure').get('description').markAsDirty();
        this.falAssistanceForm.get('awardProcedure').get('description').updateValueAndValidity();
        this.falAssistanceForm.get('approval').get('interval').markAsDirty();
        this.falAssistanceForm.get('approval').get('interval').updateValueAndValidity();
        this.falAssistanceForm.get('approval').get('description').markAsDirty();
        this.falAssistanceForm.get('approval').get('description').updateValueAndValidity();
        this.falAssistanceForm.get('appeal').get('interval').markAsDirty();
        this.falAssistanceForm.get('appeal').get('interval').updateValueAndValidity();
        this.falAssistanceForm.get('appeal').get('description').markAsDirty();
        this.falAssistanceForm.get('appeal').get('description').updateValueAndValidity();
        this.falAssistanceForm.get('renewal').get('interval').markAsDirty();
        this.falAssistanceForm.get('renewal').get('interval').updateValueAndValidity();
        this.falAssistanceForm.get('renewal').get('description').markAsDirty();
        this.falAssistanceForm.get('renewal').get('description').updateValueAndValidity();
      }
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

    setTimeout(() => {
      this.updateErrors();
    });
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

    setTimeout(() => {
      this.updateErrors();
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

  private updateErrors() {

    this.errorService.viewModel = this.viewModel;

    this.updateControlError(this.falAssistanceForm.get('deadlines').get('flag'), this.errorService.validateDeadlinesFlag().errors);
    this.updateControlError(this.falAssistanceForm.get('preApplicationCoordination').get('description'), this.errorService.validatePreAppCoordAddInfo().errors);
    this.updateControlError(this.falAssistanceForm.get('selectionCriteria').get('description'), this.errorService.validateSelCritDescription().errors);
    this.updateControlError(this.falAssistanceForm.get('awardProcedure').get('description'), this.errorService.validateAwardProcDescription().errors);
    this.updateControlError(this.falAssistanceForm.get('approval').get('interval'), this.errorService.validateApprovalInterval().errors);
    this.updateControlError(this.falAssistanceForm.get('renewal').get('interval'), this.errorService.validateRenewalInterval().errors);
    this.updateControlError(this.falAssistanceForm.get('appeal').get('interval'), this.errorService.validateAppealInterval().errors);


    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private updateControlError(control, errors){
    control.clearValidators();
    control.setValidators((control) => { return control.errors });
    control.setErrors(errors);
    setTimeout(() => {
      control.updateValueAndValidity({onlySelf: true, emitEvent: true});
    });
  }

  public beforeSaveAction() {
    this.assistSubForm.onSubFormCancelClick(this.assistSubForm.assistIndex);
  }
}
