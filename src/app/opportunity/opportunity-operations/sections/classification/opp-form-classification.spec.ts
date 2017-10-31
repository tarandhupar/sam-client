import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { OpportunityClassificationComponent } from "./opp-form-classification.component";
import { OpportunityFormService } from "../../framework/service/opportunity-form/opportunity-form.service";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";
import { OppNoticeTypeFieldService } from '../../framework/service/notice-type-field-map/notice-type-field-map.service';


describe('Opp Classification Form', () => {
  let comp: OpportunityClassificationComponent;
  let fixture: ComponentFixture<OpportunityClassificationComponent>;
  let MockFormService = jasmine.createSpyObj('MockFormService', ['getOpportunityDictionary']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        OpportunityClassificationComponent,
      ],
      providers: [
        { provide: OpportunityFormService, useValue: MockFormService },
        OppNoticeTypeFieldService
      ],
      imports: [
        SamUIKitModule,
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityClassificationComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new OpportunityFormViewModel({});
    comp.oppClassificationViewModel = comp.viewModel.oppClassificationViewModel
  });
  it('should exist', () => {
    spyOn(comp, 'loadTypeOptions').and.stub();
    fixture.detectChanges();
    expect(comp).toBeDefined();
    expect(comp.oppClassificationForm).toBeDefined();
  });
  it('should load existing data on edit page', fakeAsync(() => {
    comp.viewModel = new OpportunityFormViewModel({id: '12345'});
    let updateFormSpy = spyOn(comp, 'updateForm');
    let subscribeToChangesSpy = spyOn(comp, 'subscribeToChanges');
    spyOn(comp, 'loadTypeOptions').and.stub();
    fixture.detectChanges();
    expect(updateFormSpy).toHaveBeenCalled();
    expect(subscribeToChangesSpy).toHaveBeenCalled();
  }));
  it('should not load existing data on add page', fakeAsync(() => {
    let updateFormSpy = spyOn(comp, 'updateForm');
    spyOn(comp, 'loadTypeOptions').and.stub();
    fixture.detectChanges();

    expect(updateFormSpy).not.toHaveBeenCalled();
  }));

  it('should load type options', fakeAsync(() => {
    let dict = {
      set_aside_type: [
        {
          "elementId": "1",
          "value": "Test"
        }
      ],
      classification_code: [
        {
          "elementId": "1",
          "value": "Test"
        }
      ],
      naics_code: [
        {
          "elementId": "1",
          "value": "Test"
        }
      ],
      country: [
        {
          "elementId": "US",
          "value": "United States"
        }
      ],
      state: [
        {
          "elementId": "VA",
          "value": "Virginia"
        }
      ],

    };
    MockFormService.getOpportunityDictionary.and.returnValue(Observable.of(dict));
    let updateFormListControlsSpy = spyOn(comp, 'updateFormListControls');
    comp['loadTypeOptions']();
    tick();
    expect(updateFormListControlsSpy).toHaveBeenCalled();
    expect(comp.setAsideConfig.options.length).toBeGreaterThan(0);
    expect(comp.classificationCodeConfig.options.length).toBeGreaterThan(0);
    expect(comp.primaryNAICSCodeConfig.options.length).toBeGreaterThan(0);
    expect(comp.secondaryNAICSCodeConfig.options.length).toBeGreaterThan(0);
    expect(comp.countryConfig.options.length).toBeGreaterThan(0);
    expect(comp.stateConfig.options.length).toBeGreaterThan(0);
  }));
  it('should save setAsideType', fakeAsync(() => {
    let type = {code: '1', name: 'Test'};
    comp['saveSetAsideType'](type);
    expect(comp.oppClassificationViewModel.setAsideType).toEqual('1');
  }));
  it('should save save classificationCodeType', fakeAsync(() => {
    let type = {code: '1', name: 'Test'};
    comp['saveClassificationCodeType'](type);
    expect(comp.oppClassificationViewModel.classificationCodeType).toEqual('1');
  }));
  it('should save saveSecondaryNAICSCodeType', fakeAsync(() => {
    let types = [{code: '1', name: 'Test'}];
    comp['saveSecondaryNAICSCodeType'](types);
    expect(comp.oppClassificationViewModel.naicsCodeTypes).toEqual([{code: ['1'], type: 'Secondary'}]);
  }));
  it('should save save savePrimaryNAICSCodeType', fakeAsync(() => {
    let type = {code: '1', name: 'Test'};
    comp['savePrimaryNAICSCodeType'](type);
    expect(comp.oppClassificationViewModel.naicsCodeTypes).toEqual([{code: ['1'], type: 'Primary'}]);
  }));
  it('should save save saveCountryType', fakeAsync(() => {
    let type = {code: '1', name: 'Test'};
    comp['saveCountryType'](type);
    expect(comp.oppClassificationViewModel.countryType).toEqual('1');
  }));
  it('should save save saveStateType', fakeAsync(() => {
    let type = {code: '1', name: 'Test'};
    comp['saveStateType'](type);
    expect(comp.oppClassificationViewModel.stateType).toEqual('1');
  }));
});
