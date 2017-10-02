import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { DictionaryService } from '../../../../../api-kit/dictionary/dictionary.service';
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALFormViewModel } from '../../fal-form.model';
import { FALFormComplianceRequirementsComponent } from './fal-form-compliance-requirements.component';

let MockDictionaryService = jasmine.createSpyObj('MockDictionaryService',
  ['filterDictionariesToRetrieve', 'getProgramDictionaryById']);
MockDictionaryService.filterDictionariesToRetrieve.and.returnValue('notBlank');
MockDictionaryService.getProgramDictionaryById.and.returnValue(Observable.of(
  {
    cfr200_requirements: [
      {
        'code': 'subpartB',
        'elements': null,
        'description': null,
        'element_id': 'subpartB',
        'value': 'Subpart B, General provisions'
      },
      {
        'code': 'subpartC',
        'elements': null,
        'description': null,
        'element_id': 'subpartC',
        'value': 'Subpart C, Pre-Federal Award Requirements and Contents of Federal Awards'
      },
      {
        'code': 'subpartD',
        'elements': null,
        'description': null,
        'element_id': 'subpartD',
        'value': 'Subpart D, Post Federal; Award Requirements'
      },
      {
        'code': 'subpartE',
        'elements': null,
        'description': null,
        'element_id': 'subpartE',
        'value': 'Subpart E, Cost Principles'
      },
      {
        'code': 'subpartF',
        'elements': null,
        'description': null,
        'element_id': 'subpartF',
        'value': 'Subpart F, Audit Requirements'
      }
    ]
  }
));

let MockErrorService = jasmine.createSpyObj('MockErrorService', ['validateComplianceReports',
  'validateComplianceAudits', 'validateAdditionDocumentation', 'applicableErrors', 'findErrorById']);

describe('FAL Compliance Requirements Form', () => {
  let comp: FALFormComplianceRequirementsComponent;
  let fixture: ComponentFixture<FALFormComplianceRequirementsComponent>;

  // todo: improve test coverage
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        FALFormComplianceRequirementsComponent,
      ],
      providers: [
        {provide: DictionaryService, useValue: MockDictionaryService},
        {provide: FALFormErrorService, useValue: MockErrorService},
      ],
      imports: [
        SamUIKitModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FALFormComplianceRequirementsComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new FALFormViewModel({});
  });

  it('should exist', () => {
    fixture.detectChanges();
    expect(comp).toBeDefined();
    expect(comp.complianceRequirementsGroup).toBeDefined();
  });

  it('should load existing data', fakeAsync(() => {
    comp.viewModel = new FALFormViewModel({id: '12345'});
    let loadFormSpy = spyOn(comp, 'loadForm').and.callThrough();
    let cfr200Spy = spyOn(comp, 'loadCFR200').and.returnValue({checkbox: [], description: ''});
    let reportsSpy = spyOn(comp, 'loadReports');
    let auditsSpy = spyOn(comp, 'loadAudit');
    let recordsSpy = spyOn(comp, 'loadRecords');
    let documentsSpy = spyOn(comp, 'loadDocuments');
    let formulaMatchingSpy = spyOn(comp, 'loadFormulaMatching');
    let updateErrorsSpy = spyOn(comp, 'updateErrors');
    fixture.detectChanges();

    expect(loadFormSpy).toHaveBeenCalled();
    expect(cfr200Spy).toHaveBeenCalled();
    expect(reportsSpy).toHaveBeenCalled();
    expect(auditsSpy).toHaveBeenCalled();
    expect(recordsSpy).toHaveBeenCalled();
    expect(documentsSpy).toHaveBeenCalled();
    expect(formulaMatchingSpy).toHaveBeenCalled();
    tick();
    expect(updateErrorsSpy).toHaveBeenCalled();
  }));

  it('should load CFR200',() => {
    comp.viewModel = new FALFormViewModel({});
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    let cfr200Spy = spyOnProperty(comp.viewModel, 'CFR200Requirements', 'get');
    let cfr200Data;

    // when there is no data, return default values
    cfr200Spy.and.returnValue(null);
    cfr200Data = comp['loadCFR200'](); // array access workaround for private function
    expect(cfr200Data.checkbox).toEqual([]);
    expect([null, '']).toContain(cfr200Data.description);

    // when there is data, store list of selected questions and description
    cfr200Spy.and.returnValue({
      questions:[
        {
          code: 'subpartB',
          isSelected: false
        },
        {
          code: 'subpartC',
          isSelected: false
        },
        {
          code: 'subpartD',
          isSelected: true
        },
        {
          code: 'subpartE',
          isSelected: false
        },
        {
          code: 'subpartF',
          isSelected: true
        }
      ],
      description: 'description'
    });
    cfr200Data = comp['loadCFR200']();
    expect(cfr200Data.checkbox.sort()).toEqual(['subpartD', 'subpartF'].sort());
    expect(cfr200Data.description).toEqual('description');
  });

  it('should load reports',() => {
    comp.viewModel = new FALFormViewModel({});
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    let reportsSpy = spyOnProperty(comp.viewModel, 'complianceReports', 'get');
    let reportsData;

    // when there is no data, return default values
    reportsSpy.and.returnValue(null);
    reportsData = comp['loadReports'](); // array access workaround for private function
    expect(reportsData.checkbox).toEqual([]);
    expect(reportsData.textarea).toEqual([]);

    // when there is data, store it as a CheckboxToggledTextarea model format
    reportsSpy.and.returnValue([
      {
        code:'program',
        isSelected:true,
        description:'description'
      },
      {
        code:'cash',
        isSelected:false
      },
      {
        code:'progress',
        isSelected:true
      },
      {
        code:'expenditure',
        isSelected:true
      },
      {
        code:'performanceMonitoring',
        isSelected:false
      }
    ]);
    reportsData = comp['loadReports']();
    expect(reportsData.checkbox.sort()).toEqual(['program', 'progress', 'expenditure'].sort());
    expect(reportsData.textarea.sort()).toEqual(['description'].sort());
  });

  it('should load audits',() => {
    comp.viewModel = new FALFormViewModel({});
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    let auditsSpy = spyOnProperty(comp.viewModel, 'audit', 'get');
    let auditsData;

    // when there is no data, return default values
    auditsSpy.and.returnValue(null);
    auditsData = comp['loadAudit'](); // array access workaround for private function
    expect(auditsData.checkbox).toEqual([]);
    expect(auditsData.textarea).toEqual([]);

    // when there is applicable data, don't check 'n/a'
    auditsSpy.and.returnValue({
      description: 'description',
      isApplicable: true
    });
    auditsData = comp['loadAudit']();
    expect(auditsData.checkbox.sort()).toEqual([]);
    expect(auditsData.textarea.sort()).toEqual(['description'].sort());

    // when there is no applicable data, check 'n/a'
    auditsSpy.and.returnValue({
      description: 'description',
      isApplicable: false
    });
    auditsData = comp['loadAudit']();
    expect(auditsData.checkbox.sort()).toEqual(['na']);
    expect(auditsData.textarea.sort()).toEqual(['description'].sort());
  });

  it('should load records',() => {
    comp.viewModel = new FALFormViewModel({});
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    let recordsSpy = spyOnProperty(comp.viewModel, 'records', 'get');
    let recordsData;

    // when there is no data, return default values
    recordsSpy.and.returnValue(null);
    recordsData = comp['loadRecords'](); // array access workaround for private function
    expect([null, '']).toContain(recordsData);

    // when there is data return it
    recordsSpy.and.returnValue({
      description: 'description'
    });
    recordsData = comp['loadRecords']();
    expect(recordsData).toEqual('description');
  });

  it('should load documents',() => {
    comp.viewModel = new FALFormViewModel({});
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    let documentsSpy = spyOnProperty(comp.viewModel, 'documents', 'get');
    let documentsData;

    // when there is no data, return default values
    documentsSpy.and.returnValue(null);
    documentsData = comp['loadDocuments'](); // array access workaround for private function
    expect(documentsData.checkbox).toEqual([]);
    expect(documentsData.textarea).toEqual([]);

    // when there is applicable data, don't check 'n/a'
    documentsSpy.and.returnValue({
      description: 'description',
      isApplicable: true
    });
    documentsData = comp['loadDocuments']();
    expect(documentsData.checkbox.sort()).toEqual([]);
    expect(documentsData.textarea.sort()).toEqual(['description'].sort());

    // when there is no applicable data, check 'n/a'
    documentsSpy.and.returnValue({
      description: 'description',
      isApplicable: false
    });
    documentsData = comp['loadDocuments']();
    expect(documentsData.checkbox.sort()).toEqual(['na']);
    expect(documentsData.textarea.sort()).toEqual(['description'].sort());
  });

  it('should load formula matching',() => {
    comp.viewModel = new FALFormViewModel({});
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    let fmSpy = spyOnProperty(comp.viewModel, 'formulaAndMatching', 'get');
    let fmData;

    // when there is no data, return default values
    fmSpy.and.returnValue(null);
    fmData = comp['loadFormulaMatching'](); // array access workaround for private function
    expect(fmData).toEqual(jasmine.objectContaining({checkbox:[]}));

    fmSpy.and.returnValue({
      types: {
        moe: false,
        formula: false,
        matching: false
      }
    });
    fmData = comp['loadFormulaMatching']();
    expect(fmData).toEqual(jasmine.objectContaining({checkbox:[]}));

    // when all data is present, store it all into a model
    fmSpy.and.returnValue({
      types: {
        formula: true,
        matching: true,
        moe: true
      },
      formula: {
        title: 'title',
        chapter: 'chapter',
        part: 'part',
        subPart: 'subpart',
        publicLaw: 'public law',
        description: 'additional info'
      },
      matching: {
        requirementFlag: 'mandatory',
        percent: '50',
        description: 'matching requirements description'
      },
      moe: {
        description: 'moe and ta'
      }
    });
    fmData = comp['loadFormulaMatching']();
    // select all the option checkboxes
    expect(fmData.checkbox.sort()).toEqual(['cfr', 'matching', 'moe'].sort());
    // store all the formula fields
    expect(fmData).toEqual(jasmine.objectContaining(
      {
        title: 'title',
        chapter: 'chapter',
        part: 'part',
        subPart: 'subpart',
        publicLaw: 'public law',
        additionalInfo: 'additional info'
      }
    ));
    // store all the matching requirements fields
    expect(fmData).toEqual(jasmine.objectContaining(
      {
        matchingRequirements: 'mandatory',
        matchingPercentage: '50',
        matchingDescription: 'matching requirements description'
      }
    ));
    // store maintenance of effort description
    expect(fmData).toEqual(jasmine.objectContaining(
      {
        moeRequirements: 'moe and ta'
      }
    ));
  });
});

