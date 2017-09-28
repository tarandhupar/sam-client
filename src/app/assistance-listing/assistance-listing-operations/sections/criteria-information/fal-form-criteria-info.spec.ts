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
import {ProgramService} from '../../../../../api-kit/program/program.service';
import {FALFormOverviewComponent} from '../overview/fal-form-overview.component';
import {Observable} from 'rxjs';
// import {AppTemplatesModule} from '../../../../app-templates/index';

let MockFormService = jasmine.createSpyObj('MockFormService', ['getCriteria_Info_Dictionaries']);
MockFormService.getCriteria_Info_Dictionaries.and.returnValue(Observable.of({}));

let MockErrorService = jasmine.createSpyObj('MockErrorService', ['validateCriteriaDocumentation', 'validateApplicantList', 'validateBeneficiaryList', 'validateLengthTimeDesc', 'validateAwardedType', 'validateAssistanceUsageList', 'validateAssUsageDesc', 'validateCriteriaUsageRes', 'validateCriteriaUseDisFunds', 'validateCriteriaUseLoanTerms']);

describe('FAL Criteria Info Form', () => {
  let comp: FALFormCriteriaInfoComponent;
  let fixture: ComponentFixture<FALFormCriteriaInfoComponent>;

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
        {provide: FALFormErrorService},
      ],
      imports: [
        AppComponentsModule,
        FALComponentsModule,
        RouterTestingModule,
        SamUIKitModule,
        ReactiveFormsModule,
        // AppTemplatesModule,
      ]
    }).overrideComponent(FALFormCriteriaInfoComponent, {
      set: {
        providers: [
          {provide: FALFormService, useValue: MockFormService},
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(FALFormCriteriaInfoComponent);
    comp = fixture.componentInstance;
    spyOn(comp, 'updateErrors');
    comp.viewModel = new FALFormViewModel({});
    fixture.detectChanges();
  });
  it('should exist', () => {
    expect(comp).toBeDefined();
    expect(comp.falCriteriaForm.controls['applicantType']).toBeDefined();
    expect(comp.falCriteriaForm.controls['benType']).toBeDefined();
    expect(comp.falCriteriaForm.controls['awardedType']).toBeDefined();
    expect(comp.falCriteriaForm.controls['lengthTimeDesc']).toBeDefined();
    expect(comp.falCriteriaForm.controls['assUsageType']).toBeDefined();
    expect(comp.falCriteriaForm.controls['assUsageDesc']).toBeDefined();
    expect(comp.falCriteriaForm.controls['documentation']).toBeDefined();
    expect(comp.falCriteriaForm.controls['applicantDesc']).toBeDefined();
    expect(comp.falCriteriaForm.controls['isSameAsApplicant']).toBeDefined();
    expect(comp.falCriteriaForm.controls['benDesc']).toBeDefined();
    expect(comp.falCriteriaForm.controls['awardedDesc']).toBeDefined();
    expect(comp.falCriteriaForm.controls['usageRes']).toBeDefined();
    expect(comp.falCriteriaForm.controls['useDisFunds']).toBeDefined();
    expect(comp.falCriteriaForm.controls['useLoanTerms']).toBeDefined();
  });

  it('should parse criteria dictionaries', () => {
    comp.parseDictionariesList({
      phasing_assistance: [
        {
          "code": "lump",
          "elements": null,
          "description": null,
          "element_id": "lump",
          "value": "Lump Sum"
        },
        {
          "code": "quarterly",
          "elements": null,
          "description": null,
          "element_id": "quarterly",
          "value": "Quarterly"
        },
      ],
      assistance_usage_types: [
        {
          "code": "00",
          "elements": null,
          "description": null,
          "element_id": "1",
          "value": "No Functional Application/Unlimited Application"
        },
        {
          "code": "12",
          "elements": null,
          "description": null,
          "element_id": "2",
          "value": "Agriculture/Forestry/Fish and Game"
        },
      ],
      applicant_types: [
        {
          "code": "24",
          "elements": null,
          "description": null,
          "element_id": "0020",
          "value": "U.S. Territories and possessions"
        },
        {
          "code": "09",
          "elements": null,
          "description": null,
          "element_id": "0001",
          "value": "Government - General"
        },
      ],
      beneficiary_types: [
        {
          "code": "10",
          "elements": null,
          "description": null,
          "element_id": "1",
          "value": "Federal"
        },
        {
          "code": "11",
          "elements": null,
          "description": null,
          "element_id": "2",
          "value": "Interstate"
        },
      ],

    });
    expect(comp.awardedTypeOptions).toContain(jasmine.objectContaining({value: 'lump', label: 'Lump Sum'}));
    expect(comp.assUsageTypeOptions).toContain(jasmine.objectContaining({
      code: '1',
      name: 'No Functional Application/Unlimited Application'
    }));
    expect(comp.assUsageKeyValue['1']).toBeDefined();
    expect(comp.applicantTypeOptions).toContain(jasmine.objectContaining({
      code: '0020',
      name: 'U.S. Territories and possessions'
    }));
    expect(comp.applicantKeyValue['0020']).toBeDefined();
    expect(comp.benTypeOptions).toContain(jasmine.objectContaining({code: '1', name: 'Federal'}));
    expect(comp.benKeyValue['1']).toBeDefined();
  });

  it('should update viewmodel', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let documentationSpy = spyOnProperty(comp.viewModel, 'documentation', 'set');
    let applicantDescSpy = spyOnProperty(comp.viewModel, 'applicantDesc', 'set');
    let appListDisplaySpy = spyOnProperty(comp.viewModel, 'appListDisplay', 'set');
    let isSameAsApplicantSpy = spyOnProperty(comp.viewModel, 'isSameAsApplicant', 'set');
    let benListDisplaySpy = spyOnProperty(comp.viewModel, 'benListDisplay', 'set');
    let benDescSpy = spyOnProperty(comp.viewModel, 'benDesc', 'set');
    let lengthTimeDescSpy = spyOnProperty(comp.viewModel, 'lengthTimeDesc', 'set');
    let awardedTypeSpy = spyOnProperty(comp.viewModel, 'awardedType', 'set');
    let awardedDescSpy = spyOnProperty(comp.viewModel, 'awardedDesc', 'set');
    let assUsageDescSpy = spyOnProperty(comp.viewModel, 'assUsageDesc', 'set');
    let assListDisplaySpy = spyOnProperty(comp.viewModel, 'assListDisplay', 'set');
    let usageResSpy = spyOnProperty(comp.viewModel, 'usageRes', 'set');
    let useDisFundsSpy = spyOnProperty(comp.viewModel, 'useDisFunds', 'set');
    let useLoanTermsSpy = spyOnProperty(comp.viewModel, 'useLoanTerms', 'set');

    comp.updateViewModel({
      documentation: {isApplicable:true, description:'test'},
      applicantType: [{code:'test', name:'test'}],
      applicantDesc: 'test',
      isSameAsApplicant: 'true',
      benType: [{code:'test', name:'test'}],
      benDesc: 'test',
      lengthTimeDesc: 'test',
      awardedType: 'na',
      awardedDesc: 'test',
      assUsageType: [{code:'test', name:'test'}],
      assUsageDesc: 'test',
      usageRes: {isApplicable:true, description:'test'},
      useDisFunds: {isApplicable:true, description:'test'},
      useLoanTerms: {isApplicable:true, description:'test'}
    });

    expect(documentationSpy).toHaveBeenCalled();
    expect(applicantDescSpy).toHaveBeenCalled();
    expect(appListDisplaySpy).toHaveBeenCalled();
    expect(isSameAsApplicantSpy).toHaveBeenCalled();
    expect(benListDisplaySpy).toHaveBeenCalled();
    expect(benDescSpy).toHaveBeenCalled();
    expect(lengthTimeDescSpy).toHaveBeenCalled();
    expect(awardedTypeSpy).toHaveBeenCalled();
    expect(awardedDescSpy).toHaveBeenCalled();
    expect(assUsageDescSpy).toHaveBeenCalled();
    expect(assListDisplaySpy).toHaveBeenCalled();
    expect(usageResSpy).toHaveBeenCalled();
    expect(useDisFundsSpy).toHaveBeenCalled();
    expect(useLoanTermsSpy).toHaveBeenCalled();
    expect(comp.updateErrors).toHaveBeenCalled();

  });

  it('should update form', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let documentationSpy = spyOnProperty(comp.viewModel, 'documentation', 'get');
    let applicantDescSpy = spyOnProperty(comp.viewModel, 'applicantDesc', 'get');
    let appListDisplaySpy = spyOnProperty(comp.viewModel, 'appListDisplay', 'get');
    let isSameAsApplicantSpy = spyOnProperty(comp.viewModel, 'isSameAsApplicant', 'get');
    let benListDisplaySpy = spyOnProperty(comp.viewModel, 'benListDisplay', 'get');
    let benDescSpy = spyOnProperty(comp.viewModel, 'benDesc', 'get');
    let lengthTimeDescSpy = spyOnProperty(comp.viewModel, 'lengthTimeDesc', 'get');
    let awardedTypeSpy = spyOnProperty(comp.viewModel, 'awardedType', 'get');
    let awardedDescSpy = spyOnProperty(comp.viewModel, 'awardedDesc', 'get');
    let assUsageDescSpy = spyOnProperty(comp.viewModel, 'assUsageDesc', 'get');
    let assListDisplaySpy = spyOnProperty(comp.viewModel, 'assListDisplay', 'get');
    let usageResSpy = spyOnProperty(comp.viewModel, 'usageRes', 'get');
    let useDisFundsSpy = spyOnProperty(comp.viewModel, 'useDisFunds', 'get');
    let useLoanTermsSpy = spyOnProperty(comp.viewModel, 'useLoanTerms', 'get');

    comp.updateForm();

    expect(documentationSpy).toHaveBeenCalled();
    expect(applicantDescSpy).toHaveBeenCalled();
   /* expect(appListDisplaySpy).toHaveBeenCalled();*/
    expect(isSameAsApplicantSpy).toHaveBeenCalled();
/*    expect(benListDisplaySpy).toHaveBeenCalled();*/
    expect(benDescSpy).toHaveBeenCalled();
    expect(lengthTimeDescSpy).toHaveBeenCalled();
    expect(awardedTypeSpy).toHaveBeenCalled();
    expect(awardedDescSpy).toHaveBeenCalled();
    expect(assUsageDescSpy).toHaveBeenCalled();
    /*expect(assListDisplaySpy).toHaveBeenCalled();*/
    expect(usageResSpy).toHaveBeenCalled();
    expect(useDisFundsSpy).toHaveBeenCalled();
    expect(useLoanTermsSpy).toHaveBeenCalled();
    expect(comp.updateErrors).toHaveBeenCalled();
  });
  it('should save documentation isApplicable', () => {
    expect(comp.saveChkToggleTextarea({
      checkbox: [],
      textarea: ["zxczxczxc"]
    }))
      .toEqual({
        isApplicable: true,
        description: "zxczxczxc",
      });

  });
  it('should save documentation is not applicable', () => {
    expect(comp.saveChkToggleTextarea({
      checkbox: ["na"],
      textarea: ["zxczxczxc"]
    }))
      .toEqual({
        isApplicable: false,
        description: "zxczxczxc"
      });
  });
  it('should load documentation isApplicable', () => {
    expect(comp.loadChkToggleTextarea({
      isApplicable: true,
      description: "zxczxczxc",
    }))
      .toEqual({
        checkbox: [],
        textarea: ["zxczxczxc"]
      });
  });

  it('should load documentation is not Applicable', () => {
    expect(comp.loadChkToggleTextarea({
      isApplicable: false,
      description: "zxczxczxc",
    }))
      .toEqual({
        checkbox: ["na"],
        textarea: ["zxczxczxc"]
      });
  });

  it('should toggle Award Desc for true', () => {
    comp.toggleAwardDesc('other');
    expect(comp.awardedTextarea).toBeTruthy();
  });

  it('should toggle Award Desc for false', () => {
    comp.toggleAwardDesc('other123');
    expect(comp.awardedTextarea).toBeFalsy();
  });

  it('should placeholder Msg', () => {
    expect(comp.placeholderMsg([])).toEqual('None Selected');
    expect(comp.placeholderMsg([123])).toEqual('One Type Selected');
    expect(comp.placeholderMsg([123,321])).toEqual('Multiple Types Selected');
  });

  it('should chkSameAsApp', () => {
    comp.chkSameAsApp(['isSameAsApplicant']);
    expect(comp.toggleBenSection).toBeTruthy();
  });

  it('should loadIsSameasApplicant', () => {
    expect(comp.loadIsSameasApplicant(true).length).toEqual(1);
    expect(comp.toggleBenSection).toBeTruthy();
  });
  it('should saveMultiListType', () => {
    expect(comp.saveMultiListType({code:'1', name:'test'}).length).toEqual(0);
  });
});
