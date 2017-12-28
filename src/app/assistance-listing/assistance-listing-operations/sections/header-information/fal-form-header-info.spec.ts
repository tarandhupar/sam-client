import { TestBed, ComponentFixture, async, fakeAsync} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FALFormService } from '../../fal-form.service';
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALFormComponent } from '../../fal-form.component';
import { SideNavComponent } from '../../navigation/side-nav.component';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
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
import { ProgramService } from '../../../../../api-kit/program/program.service';
import { FALFormOverviewComponent } from '../overview/fal-form-overview.component';
import { Observable } from 'rxjs';
// import { AppTemplatesModule } from '../../../../app-templates/index';

let MockFormService = jasmine.createSpyObj('MockFormService', ['getRelatedProgramList', 'getFederalHierarchyConfiguration', 'getCfdaCode', 'getFALPermission', 'getOrganization']);
MockFormService.getFALPermission.and.returnValue(Observable.of({}));
MockFormService.getOrganization.and.returnValue(Observable.of({}));
MockFormService.getFederalHierarchyConfiguration.and.returnValue(Observable.of({}));
let MockProgramService = jasmine.createSpyObj('MockProgramService', ['isProgramNumberUnique']);
let MockErrorService = jasmine.createSpyObj('MockErrorService', ['validateHeaderTitle', 'validateFederalAgency', 'applicableErrors']);

describe('FAL Header Info Form', () => {
  let comp: FALFormHeaderInfoComponent;
  let fixture: ComponentFixture<FALFormHeaderInfoComponent>;

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
        {provide: FALFormErrorService, useValue: MockErrorService},
      ],
      imports: [
        AppComponentsModule,
        FALComponentsModule,
        RouterTestingModule,
        SamUIKitModule,
        ReactiveFormsModule,
        // AppTemplatesModule,
      ]
    }).overrideComponent(FALFormHeaderInfoComponent, {
      set: {
        providers: [
          {provide: FALFormService, useValue: MockFormService},
          {provide: ProgramService, useValue: MockProgramService},
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FALFormHeaderInfoComponent);
    comp = fixture.componentInstance;
    spyOn(comp, 'updateErrors');
    comp.viewModel = new FALFormViewModel({});
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(comp).toBeDefined();
    expect(comp.falHeaderInfoForm.controls['title']).toBeDefined();
    expect(comp.falHeaderInfoForm.controls['alternativeNames']).toBeDefined();
    expect(comp.falHeaderInfoForm.controls['programNumber']).toBeDefined();
    expect(comp.falHeaderInfoForm.controls['relatedPrograms']).toBeDefined();
    expect(comp.falHeaderInfoForm.controls['federalAgency']).toBeDefined();
  });

  it('should parse related programs', () => {
    comp.parseRelatedPrograms([
      {
        id: '3b0a74bc',
        value: '10.112 - Price Loss Coverage',
      },
    ]);

    expect(comp.falHeaderInfoForm.controls['relatedPrograms'].value).toEqual([{code: '3b0a74bc', name: '10.112 - Price Loss Coverage'}]);
  });

  it('should format related programs', () => {
    expect(comp.updateViewModelRelatedPrograms([
      {
        code: '3b0a74bc',
        name: '10.112 - Price Loss Coverage',
      },
    ])).toEqual([
      '3b0a74bc',
    ]);
  });

  it('should update form', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let titleSpy = spyOnProperty(comp.viewModel, 'title', 'get');
    let alternativeNamesSpy = spyOnProperty(comp.viewModel, 'alternativeNames', 'get').and.callThrough();
    let programNumberSpy = spyOnProperty(comp.viewModel, 'programNumber', 'get');
    let orgIdSpy = spyOnProperty(comp.viewModel, 'organizationId', 'get');

    MockFormService.getFederalHierarchyConfiguration.and.returnValue(Observable.of({
      programNumberAuto: true,
    }));
    comp.updateForm();

    expect(titleSpy).toHaveBeenCalled();
    expect(alternativeNamesSpy).toHaveBeenCalled();
    expect(programNumberSpy).toHaveBeenCalled();
    expect(orgIdSpy).toHaveBeenCalled();
  });

  it('should save title', fakeAsync(() => {
    let title = 'Test title';
    let updateErrorSpy = spyOn(comp, 'updateTitleError');
    comp['saveTitle'](title);
    expect(comp.viewModel.title).toEqual(title);
    fixture.detectChanges();
    expect(updateErrorSpy).toHaveBeenCalled();
  }));

  it('should save AlternativeNames', fakeAsync(() => {
    let altname = 'popular name';
    comp['saveAlternativeNames'](altname);
    expect(comp.viewModel.alternativeNames).toEqual([altname]);
  }));

  it('should save programNo', fakeAsync(() => {
    let progNo = '233';
    let fhConfigSpy = spyOn(comp, 'getFHConfig');
    let updateErrorSpy = spyOn(comp, 'updateProgNoError');
    comp['saveProgramNo'](progNo);
    expect(comp.viewModel.programNumber).toEqual('.' + progNo);
    fixture.detectChanges();
    expect(updateErrorSpy).toHaveBeenCalled();
  }));

  it('should clear FAL No Field', fakeAsync(() => {
    comp.viewModel.programNumber = '123';
    comp['clearFALField']();
    expect(comp.viewModel.programNumber).toEqual('');
  }));

});
