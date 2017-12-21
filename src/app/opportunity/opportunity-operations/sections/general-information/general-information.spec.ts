import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityFormService } from '../../framework/service/opportunity-form/opportunity-form.service';
import { OpportunityGeneralInfoComponent } from './general-information.component';
import { OpportunityFormErrorService } from '../../opportunity-form-error.service';
import {OppGeneralInfoViewModel} from "../../framework/data-model/sections/general-information/general-information.model";
import {OppNoticeTypeMapService} from "../../framework/service/notice-type-map/notice-type-map.service";
import {OpportunitySideNavService} from "../../framework/service/sidenav/opportunity-form-sidenav.service";

describe('Opportunity General Info Form', () => {
  let dataModel: OppGeneralInfoViewModel;
  let comp: OpportunityGeneralInfoComponent;
  let fixture: ComponentFixture<OpportunityGeneralInfoComponent>;
  let MockFormService = jasmine.createSpyObj('MockFormService', ['getOpportunityDictionary']);
  let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        OpportunityGeneralInfoComponent,
      ],
      providers: [
        { provide: OpportunityFormService, useValue: MockFormService },
        OpportunityFormErrorService,
        OppNoticeTypeMapService,
        OpportunitySideNavService
      ],
      imports: [
        SamUIKitModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityGeneralInfoComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new OpportunityFormViewModel({});
    comp.oppGeneralInfoViewModel = comp.viewModel.oppGeneralInfoViewModel;
  });

  it('should exist', () => {
    spyOn(comp, 'loadArchiveTypeOptions').and.stub();
    spyOn(comp, 'loadYesNoOptions').and.stub();
    fixture.detectChanges();
    expect(comp).toBeDefined();
    expect(comp.generalInfoForm).toBeDefined();
  });

  it('should load existing data on edit page', fakeAsync(() => {
    comp.viewModel = new OpportunityFormViewModel({id: '12345'});
    let updateFormSpy = spyOn(comp, 'updateForm');
    let subscribeToChangesSpy = spyOn(comp, 'subscribeToChanges');
    spyOn(comp, 'loadArchiveTypeOptions').and.stub();
    spyOn(comp, 'loadYesNoOptions').and.stub();
    fixture.detectChanges();

    expect(updateFormSpy).toHaveBeenCalled();
    expect(subscribeToChangesSpy).toHaveBeenCalled();
  }));

  it('should load archive type options', fakeAsync(() => {
    MockFormService.getOpportunityDictionary.and.returnValue(Observable.of({
      archive_type: [
        {
          elementId: 'testArchiveType',
          value: 'Test',
        }
      ]
    }));

    comp['loadArchiveTypeOptions']();
    tick();
    expect(comp.archiveTypeConfig.options.length).toBeGreaterThan(0);
  }));

  it('should load yes no options', fakeAsync(() => {
    MockFormService.getOpportunityDictionary.and.returnValue(Observable.of({
      yes_no: [
        {
          elementId: '1',
          value: '123',
        }
      ]
    }));

    comp['loadYesNoOptions']();
    tick();
    expect(comp.vendorsCDIvlConfig.options.length).toBeGreaterThan(0);
    expect(comp.vendorsVIvlConfig.options.length).toBeGreaterThan(0);
  }));

  xit('should save archive type', fakeAsync(() => {
    let type = 'testType';
    comp['saveArchiveType'](type);
    expect(comp.oppGeneralInfoViewModel.archiveType).toEqual(type);
  }));

  xit('should save archive date', fakeAsync(() => {
    let archiveDate = 'testDate';
    comp['saveArchiveDate'](archiveDate);
    expect(comp.oppGeneralInfoViewModel.archiveDate).toEqual(archiveDate);
  }));

  xit('should save vendor CD IVL permission', fakeAsync(() => {
    let option = 'no';
    comp['saveVendorsCDIvl'](option);
    expect(comp.oppGeneralInfoViewModel.vendorCDIvl).toEqual(option);
  }));

  xit('should save vendor CD Read permission', fakeAsync(() => {
    let _data = {
      permissions: {
        ivl: {
          read: false
        }
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    fixture.detectChanges();
    let errorSpy = spyOn(comp, 'updateIvlViewError');
    let option = 'no';
    comp['saveVendorsViewIvl'](option);
    expect(comp.oppGeneralInfoViewModel.vendorViewIvl).toEqual(false);
    fixture.detectChanges();
    expect(errorSpy).toHaveBeenCalled();
  }));

  it('should save saveAddiReportingTypes isSelected true', fakeAsync(() => {
    let data = [{
      code: 'isRecoveryRelated',
      name: 'Recovery and Reinvestment Act'
    }];
    comp['saveAddiReportingTypes'](data);
    expect(comp.oppGeneralInfoViewModel.addiReportingTypes).toEqual([{
      code: 'isRecoveryRelated',
      isSelected: true
    }]);
  }));
  it('should save saveAddiReportingTypes isSelected false', fakeAsync(() => {
    let data = [];
    comp['saveAddiReportingTypes'](data);
    expect(comp.oppGeneralInfoViewModel.addiReportingTypes).toEqual([{
      code: 'isRecoveryRelated',
      isSelected: false
    }]);
  }));

});
