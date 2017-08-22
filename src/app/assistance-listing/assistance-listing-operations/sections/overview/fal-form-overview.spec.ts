import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FALFormOverviewComponent } from './fal-form-overview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FALFormService } from '../../fal-form.service';
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALFormComponent } from '../../fal-form.component';
import { SideNavComponent } from '../../navigation/side-nav.component';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { FALFormHeaderInfoComponent } from '../header-information/fal-form-header-info.component';
import { FALFormViewModel } from '../../fal-form.model';
import { FALFormObligationsInfoComponent } from '../financial-info/obligations/fal-form-obligation-info.component';
import { FALFormContactInfoComponent } from '../contact-information/fal-form-contact.component';
import { FALAssistanceComponent } from '../applying-for-assistance/fal-form-applying-assistance.component';
import { FALFormFinancialInfoOtherComponent } from '../financial-info/other/fal-form-financial-info-other.component';
import { FALFormCriteriaInfoComponent } from '../criteria-information/fal-form-criteria-info.component';
import { FALFormComplianceRequirementsComponent } from '../compliance-requirements/fal-form-compliance-requirements.component';
import { FALAuthorizationsComponent } from '../authorizations/fal-form-authorizations.component';
import { AppComponentsModule } from '../../../../app-components/app-components.module';
import { FALComponentsModule } from '../../../components/index';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppTemplatesModule } from '../../../../app-templates/index';

let MockFormService = jasmine.createSpyObj('MockFormService', ['getFunctionalCodesDict', 'getSubjectTermsDict']);
MockFormService.getFunctionalCodesDict.and.returnValue(Observable.of({}));
MockFormService.getSubjectTermsDict.and.returnValue(Observable.of({}));

let MockErrorService = jasmine.createSpyObj('MockErrorService', ['validateObjective', 'validateFunctionalCodes', 'validateSubjectTerms', 'validateFundedProjects', 'applicableErrors']);

describe('FAL Overview Form', () => {
  let comp: FALFormOverviewComponent;
  let fixture: ComponentFixture<FALFormOverviewComponent>;

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
        AppTemplatesModule,
      ]
    }).overrideComponent(FALFormOverviewComponent, {
      set: {
        providers: [
          { provide: FALFormService, useValue: MockFormService },
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FALFormOverviewComponent);
    comp = fixture.componentInstance;
    spyOn(comp, 'updateErrors');
    comp.viewModel = new FALFormViewModel({});
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(comp).toBeDefined();
    expect(comp.falOverviewForm.controls['objective']).toBeDefined();
    expect(comp.falOverviewForm.controls['description']).toBeDefined();
    expect(comp.falOverviewForm.controls['functionalTypes']).toBeDefined();
    expect(comp.falOverviewForm.controls['subjectTermsTypes']).toBeDefined();
    expect(comp.falOverviewForm.controls['fundedProjects']).toBeDefined();
  });

  // todo: improve these tests
  it('should parse functional codes', () => {
    comp.parseFunctionalCodes({
      functional_codes: [
        {
          code: null,
          description: null,
          element_id: '0001',
          elements: [
            {
              code: 'AK',
              description: null,
              element_id: '0001001',
              elements: null,
              value: "Resource Conservation and Development",
            },
            {
              code: 'AL',
              description: null,
              element_id: '0001002',
              elements: null,
              value: "Production and Operation",
            },
          ],
          value: 'AGRICULTURAL',
        },
      ],
    });

    expect(comp.fcTypeOptions).toContain(jasmine.objectContaining({code: '0001001', name: 'AK - Resource Conservation and Development', category: 'AGRICULTURAL'}));
    expect(comp.fcKeyValue['0001001']).toBeDefined();
    expect(comp.fcTypeOptions).toContain(jasmine.objectContaining({code: '0001002', name: 'AL - Production and Operation', category: 'AGRICULTURAL'}));
    expect(comp.fcKeyValue['0001002']).toBeDefined();
  });


  it('should parse subject terms', () => {
    MockFormService.getSubjectTermsDict.and.returnValue(
      Observable.of({
        program_subject_terms: [
          {
            code: '120',
            description: null,
            element_id: '0031011',
            value: 'wildlife conservation',
          },
        ],
      })
    );

    comp.parseSubjectTerms({});

    expect(comp.falOverviewForm.controls['subjectTermsTypes'].value).toContain(jasmine.objectContaining({code: '0031011', name: '120 - wildlife conservation'}));
  });

  it('should update viewmodel', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let objectiveSpy = spyOnProperty(comp.viewModel, 'objective', 'set');
    let descriptionSpy = spyOnProperty(comp.viewModel, 'description', 'set');
    let functionalCodesSpy = spyOnProperty(comp.viewModel, 'functionalCodes', 'set');
    let subjectTermsSpy = spyOnProperty(comp.viewModel, 'subjectTerms', 'set');
    let projectsSpy = spyOnProperty(comp.viewModel, 'projects', 'set');

    comp.updateViewModel({
      objective: 'objective',
      description: 'description',
      functionalTypes: [],
      subjectTermsTypes: [],
      projects: null,
    });

    expect(objectiveSpy).toHaveBeenCalled();
    expect(descriptionSpy).toHaveBeenCalled();
    expect(functionalCodesSpy).toHaveBeenCalled();
    expect(subjectTermsSpy).toHaveBeenCalled();
    expect(projectsSpy).toHaveBeenCalled();
    expect(comp.updateErrors).toHaveBeenCalled();
  });

  it('should update form', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let objectiveSpy = spyOnProperty(comp.viewModel, 'objective', 'get');
    let descriptionSpy = spyOnProperty(comp.viewModel, 'description', 'get');
    let fundedProjectsSpy = spyOnProperty(comp.viewModel, 'projects', 'get');

    comp.updateForm();

    expect(objectiveSpy).toHaveBeenCalled();
    expect(descriptionSpy).toHaveBeenCalled();
    expect(fundedProjectsSpy).toHaveBeenCalled();
    expect(comp.updateErrors).toHaveBeenCalled();
  });

  it('should save projects', () => {
    expect(comp.saveProjects({
      isApplicable: true,
      entries: [
        {
          year: '1999',
          description: 'test',
        },
        {
          year: 2000,
          description: 'test2',
        },
        {
          year: '',
          description: '',
        },
        {
          year: null,
          description: null,
        }
      ],
    }))
    .toEqual({
      isApplicable: true,
      list: [
        {
          fiscalYear: 1999,
          description: 'test',
        },
        {
          fiscalYear: 2000,
          description: 'test2',
        },
        {
          fiscalYear: null,
          description: '',
        },
        {
          fiscalYear: null,
          description: null,
        },
      ],
    });
  });

  it('should load projects', () => {
    expect(comp.loadProjects({
      isApplicable: true,
      list: [
        {
          fiscalYear: 1999,
          description: 'test',
        },
        {
          fiscalYear: 2000,
          description: 'test2',
        },
        {
          fiscalYear: null,
          description: '',
        },
        {
          fiscalYear: null,
          description: null,
        },
      ],
    }))
    .toEqual({
      isApplicable: true,
      entries: [
        {
          year: 1999,
          description: 'test',
        },
        {
          year: 2000,
          description: 'test2',
        },
        {
          year: null,
          description: '',
        },
        {
          year: null,
          description: null,
        }
      ],
    });
  });
});
