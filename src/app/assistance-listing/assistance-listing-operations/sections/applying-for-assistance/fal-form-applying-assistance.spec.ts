import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {FALFormService} from '../../fal-form.service';
import {FALFormErrorService} from '../../fal-form-error.service';
import {FALFormComponent} from '../../fal-form.component';
import {SideNavComponent} from '../../navigation/side-nav.component';
import {SamUIKitModule} from 'sam-ui-kit/index';
import {FALFormHeaderInfoComponent} from '../header-information/fal-form-header-info.component';
import {FALFormViewModel} from '../../fal-form.model';
import {FALFormObligationsInfoComponent} from '../financial-info/obligations/fal-form-obligation-info.component';
import {FALFormContactInfoComponent} from '../contact-information/fal-form-contact.component';
import {FALAssistanceComponent} from '../applying-for-assistance/fal-form-applying-assistance.component';
import {FALFormFinancialInfoOtherComponent} from '../financial-info/other/fal-form-financial-info-other.component';
import {FALFormCriteriaInfoComponent} from '../criteria-information/fal-form-criteria-info.component';
import {FALFormComplianceRequirementsComponent} from '../compliance-requirements/fal-form-compliance-requirements.component';
import {FALAuthorizationsComponent} from '../authorizations/fal-form-authorizations.component';
import {AppComponentsModule} from '../../../../app-components/app-components.module';
import {FALComponentsModule} from '../../../components/index';
import {ReactiveFormsModule} from '@angular/forms';
import {FALFormOverviewComponent} from '../overview/fal-form-overview.component';
import {Observable} from 'rxjs';

let MockFormService = jasmine.createSpyObj('MockFormService', ['getAssistanceDict']);
MockFormService.getAssistanceDict.and.returnValue(Observable.of({}));

let MockErrorService = jasmine.createSpyObj('MockErrorService', ['validateDeadlineList','validateDeadlinesFlag', 'validatePreAppCoordAddInfo', 'validateSelCritDescription', 'validateAwardProcDescription', 'validateApprovalInterval', 'validateRenewalInterval', 'validateAppealInterval','applicableErrors']);

describe('FAL Applying for Assistance Form', () => {
  let comp: FALAssistanceComponent;
  let fixture: ComponentFixture<FALAssistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FALFormComponent,
        SideNavComponent,
        FALFormHeaderInfoComponent,
        FALFormOverviewComponent,
        FALFormObligationsInfoComponent,
        FALFormContactInfoComponent,
        FALAssistanceComponent,
        FALFormFinancialInfoOtherComponent,
        FALFormCriteriaInfoComponent,
        FALFormComplianceRequirementsComponent,
        FALAuthorizationsComponent,
      ],
      providers: [
        { provide: FALFormErrorService, useValue: MockErrorService },
      ],
      imports: [
        AppComponentsModule,
        FALComponentsModule,
        RouterTestingModule,
        SamUIKitModule,
        ReactiveFormsModule,
      ]
    }).overrideComponent(FALAssistanceComponent, {
      set: {
        providers: [
          { provide: FALFormService, useValue: MockFormService },
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(FALAssistanceComponent);
    comp = fixture.componentInstance;
    spyOn(comp, 'updateErrors');
    comp.viewModel = new FALFormViewModel({});
    fixture.detectChanges();
  });
  it('should exist', () => {
    expect(comp).toBeDefined();
    expect(comp.falAssistanceForm.controls['deadlines']).toBeDefined();
    expect(comp.falAssistanceForm.get('deadlines').get('flag')).toBeDefined();
    expect(comp.falAssistanceForm.get('deadlines').get('description')).toBeDefined();
    expect(comp.falAssistanceForm.get('deadlines').get('list')).toBeDefined();
    expect(comp.falAssistanceForm.controls['preApplicationCoordination']).toBeDefined();
    expect(comp.falAssistanceForm.get('preApplicationCoordination').get('reports')).toBeDefined();
    expect(comp.falAssistanceForm.get('preApplicationCoordination').get('description')).toBeDefined();
    expect(comp.falAssistanceForm.controls['applicationProcedure']).toBeDefined();
    expect(comp.falAssistanceForm.get('applicationProcedure').get('isApplicable')).toBeDefined();
    expect(comp.falAssistanceForm.get('applicationProcedure').get('description')).toBeDefined();
    expect(comp.falAssistanceForm.controls['selectionCriteria']).toBeDefined();
    expect(comp.falAssistanceForm.get('selectionCriteria').get('isApplicable')).toBeDefined();
    expect(comp.falAssistanceForm.get('selectionCriteria').get('description')).toBeDefined();
    expect(comp.falAssistanceForm.controls['awardProcedure']).toBeDefined();
    expect(comp.falAssistanceForm.get('awardProcedure').get('description')).toBeDefined();
    expect(comp.falAssistanceForm.controls['approval']).toBeDefined();
    expect(comp.falAssistanceForm.get('approval').get('interval')).toBeDefined();
    expect(comp.falAssistanceForm.get('approval').get('description')).toBeDefined();
    expect(comp.falAssistanceForm.controls['appeal']).toBeDefined();
    expect(comp.falAssistanceForm.get('appeal').get('interval')).toBeDefined();
    expect(comp.falAssistanceForm.get('appeal').get('description')).toBeDefined();
    expect(comp.falAssistanceForm.controls['renewal']).toBeDefined();
    expect(comp.falAssistanceForm.get('renewal').get('interval')).toBeDefined();
    expect(comp.falAssistanceForm.get('renewal').get('description')).toBeDefined();
  });

  it('should parse applying for assistance has deadline', () => {
    MockFormService.getAssistanceDict.and.returnValue(
      Observable.of({
        deadline_flag: [
          {
            "code": "yes",
            "elements": null,
            "description": null,
            "element_id": "yes",
            "value": "This program has deadline information"
          },
        ],

      })
    );
    comp.setDictOptions();
    expect(comp.deadlinesFlagOptions).toContain(jasmine.objectContaining({
      label: 'This program has deadline information',
      value: 'yes'
    }));
  });

  it('should parse applying for assistance no deadline', () => {
    MockFormService.getAssistanceDict.and.returnValue(
      Observable.of({
        deadline_flag: [
          {
            "code": "no",
            "elements": null,
            "description": null,
            "element_id": "no",
            "value": "Deadlines do not apply"
          }
        ],

      })
    );
    comp.setDictOptions();
    expect(comp.deadlinesFlagOptions).toContain(jasmine.objectContaining({
      label: 'Deadlines do not apply',
      value: 'no'
    }));
  });
  it('should parse applying for assistance contact headquarters', () => {
    MockFormService.getAssistanceDict.and.returnValue(
      Observable.of({
        deadline_flag: [
          {
            "code": "contact",
            "elements": null,
            "description": null,
            "element_id": "contact",
            "value": "Contact the headquarters or regional office, as appropriate, for application deadlines"
          }
        ],

      })
    );
    comp.setDictOptions();
    expect(comp.deadlinesFlagOptions).toContain(jasmine.objectContaining({
      label: 'Contact the headquarters or regional office, as appropriate, for application deadlines',
      value: 'contact'
    }));
  });


  it('should parse applying for assistance date range dictionaries', () => {
    MockFormService.getAssistanceDict.and.returnValue(
      Observable.of({
        date_range: [
          {
            "code": "1",
            "elements": null,
            "description": null,
            "element_id": "1",
            "value": "From 1 to 15 days"
          },
        ],
      })
    );
    comp.dateRangeOptions = [{label: 'From 1 to 15 days', value: '1'}];
    comp.setDictOptions();
    expect(comp.dateRangeOptions).toContain(jasmine.objectContaining({
      label: 'From 1 to 15 days',
      value: '1'
    }));
  });

  it('should parse applying for assistance date range defaults', () => {
    comp.setDictOptions();
    expect(comp.dateRangeOptions).toContain(jasmine.objectContaining({
      label: 'None Selected',
      value: 'na'
    }));
  });


  it('should update viewmodel', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let deadlineFlagSpy = spyOnProperty(comp.viewModel, 'deadlineFlag', 'set');
    let deadlineDescSpy = spyOnProperty(comp.viewModel, 'deadlineDesc', 'set');
    let deadlineListSpy = spyOnProperty(comp.viewModel, 'deadlineList', 'set');
    let preAppCoordReportsSpy = spyOnProperty(comp.viewModel, 'preAppCoordReports', 'set');
    let preAppCoordDescSpy = spyOnProperty(comp.viewModel, 'preAppCoordDesc', 'set');
    let appProcIsAppSpy = spyOnProperty(comp.viewModel, 'appProcIsApp', 'set');
    let appProcDescSpy = spyOnProperty(comp.viewModel, 'appProcDesc', 'set');
    let selCriteriaIsAppSpy = spyOnProperty(comp.viewModel, 'selCriteriaIsApp', 'set');
    let selCriteriaDescSpy = spyOnProperty(comp.viewModel, 'selCriteriaDesc', 'set');
    let awardProcDescSpy = spyOnProperty(comp.viewModel, 'awardProcDesc', 'set');
    let approvalIntervalSpy = spyOnProperty(comp.viewModel, 'approvalInterval', 'set');
    let approvalDescSpy = spyOnProperty(comp.viewModel, 'approvalDesc', 'set');
    let appealIntervalSpy = spyOnProperty(comp.viewModel, 'appealInterval', 'set');
    let appealDescSpy = spyOnProperty(comp.viewModel, 'appealDesc', 'set');
    let renewalIntervalSpy = spyOnProperty(comp.viewModel, 'renewalInterval', 'set');
    let renewalDescSpy = spyOnProperty(comp.viewModel, 'renewalDesc', 'set');

    comp.updateViewModel({
      deadlines: {
        flag: 'yes',
        description: 'This program has deadline information',
        list: [{start: '', end: '', description: ''}]
      },
      preApplicationCoordination: {reports: [{isSelected: true, reportCode: '"statement"'}], description: 'test'},
      applicationProcedure: {isApplicable: ['true'], description: 'test'},
      selectionCriteria: {isApplicable: ['true'], description: 'test'},
      awardProcedure: {description: 'test'},
      approval: {interval: "4", description: 'test'},
      appeal: {interval: "4", description: 'test'},
      renewal: {interval: "4", description: 'test'},
    });

    expect(deadlineFlagSpy).toHaveBeenCalled();
    expect(deadlineDescSpy).toHaveBeenCalled();
    expect(deadlineListSpy).toHaveBeenCalled();
    expect(preAppCoordReportsSpy).toHaveBeenCalled();
    expect(preAppCoordDescSpy).toHaveBeenCalled();
    expect(appProcIsAppSpy).toHaveBeenCalled();
    expect(appProcDescSpy).toHaveBeenCalled();
    expect(selCriteriaIsAppSpy).toHaveBeenCalled();
    expect(selCriteriaDescSpy).toHaveBeenCalled();
    expect(awardProcDescSpy).toHaveBeenCalled();
    expect(approvalIntervalSpy).toHaveBeenCalled();
    expect(approvalDescSpy).toHaveBeenCalled();
    expect(appealIntervalSpy).toHaveBeenCalled();
    expect(appealDescSpy).toHaveBeenCalled();
    expect(renewalIntervalSpy).toHaveBeenCalled();
    expect(renewalDescSpy).toHaveBeenCalled();

  });

  it('should update form', () => {
   // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
   // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let deadlineFlagSpy = spyOnProperty(comp.viewModel, 'deadlineFlag', 'get');
    let deadlineDescSpy = spyOnProperty(comp.viewModel, 'deadlineDesc', 'get');
    let deadlineListSpy = spyOnProperty(comp.viewModel, 'deadlineList', 'get');
    let preAppCoordReportsSpy = spyOnProperty(comp.viewModel, 'preAppCoordReports', 'get');
    let preAppCoordDescSpy = spyOnProperty(comp.viewModel, 'preAppCoordDesc', 'get');
    let appProcIsAppSpy = spyOnProperty(comp.viewModel, 'appProcIsApp', 'get');
    let appProcDescSpy = spyOnProperty(comp.viewModel, 'appProcDesc', 'get');
    let selCriteriaIsAppSpy = spyOnProperty(comp.viewModel, 'selCriteriaIsApp', 'get');
    let selCriteriaDescSpy = spyOnProperty(comp.viewModel, 'selCriteriaDesc', 'get');
    let awardProcDescSpy = spyOnProperty(comp.viewModel, 'awardProcDesc', 'get');
    let approvalIntervalSpy = spyOnProperty(comp.viewModel, 'approvalInterval', 'get');
    let approvalDescSpy = spyOnProperty(comp.viewModel, 'approvalDesc', 'get');
    let appealIntervalSpy = spyOnProperty(comp.viewModel, 'appealInterval', 'get');
    let appealDescSpy = spyOnProperty(comp.viewModel, 'appealDesc', 'get');
    let renewalIntervalSpy = spyOnProperty(comp.viewModel, 'renewalInterval', 'get');
    let renewalDescSpy = spyOnProperty(comp.viewModel, 'renewalDesc', 'get');


   comp.updateForm();

    expect(deadlineFlagSpy).toHaveBeenCalled();
    expect(deadlineDescSpy).toHaveBeenCalled();
    expect(deadlineListSpy).toHaveBeenCalled();
    expect(preAppCoordReportsSpy).toHaveBeenCalled();
    expect(preAppCoordDescSpy).toHaveBeenCalled();
    expect(appProcIsAppSpy).toHaveBeenCalled();
    expect(appProcDescSpy).toHaveBeenCalled();
    expect(selCriteriaIsAppSpy).toHaveBeenCalled();
    expect(selCriteriaDescSpy).toHaveBeenCalled();
    expect(awardProcDescSpy).toHaveBeenCalled();
    expect(approvalIntervalSpy).toHaveBeenCalled();
    expect(approvalDescSpy).toHaveBeenCalled();
    expect(appealIntervalSpy).toHaveBeenCalled();
    expect(appealDescSpy).toHaveBeenCalled();
    expect(renewalIntervalSpy).toHaveBeenCalled();
    expect(renewalDescSpy).toHaveBeenCalled();
   });
  it('should formatAssistInfo', () => {
    expect(comp.formatAssistInfo({dateRange: {startDate: "2004-04-04", endDate: "2005-02-01"}, description: 'Test'})).toEqual('April 04, 2004 - February 01, 2005. Test');
  });
});

