import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form.model';
import { OpportunityFormService } from '../../framework/service/opportunity-form.service';
import { OpportunityHeaderInfoComponent } from './opp-form-header-info.component';

describe('FAL Header Info Form', () => {
  let comp: OpportunityHeaderInfoComponent;
  let fixture: ComponentFixture<OpportunityHeaderInfoComponent>;
  let MockFormService = jasmine.createSpyObj('MockFormService', ['getOpportunityDictionary']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        OpportunityHeaderInfoComponent,
      ],
      providers: [
        { provide: OpportunityFormService, useValue: MockFormService },
      ],
      imports: [
        SamUIKitModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityHeaderInfoComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new OpportunityFormViewModel({});
  });

  it('should exist', () => {
    spyOn(comp, 'loadTypeOptions').and.stub();
    fixture.detectChanges();
    expect(comp).toBeDefined();
    expect(comp.oppHeaderInfoForm).toBeDefined();
  });

  it('should load existing data on edit page', fakeAsync(() => {
    comp.viewModel = new OpportunityFormViewModel({id: '12345'});
    let updateFormSpy = spyOn(comp, 'updateForm');
    spyOn(comp, 'loadTypeOptions').and.stub();
    fixture.detectChanges();

    expect(updateFormSpy).toHaveBeenCalled();
  }));

  it('should not load existing data on add page', fakeAsync(() => {
    let updateFormSpy = spyOn(comp, 'updateForm');
    spyOn(comp, 'loadTypeOptions').and.stub();
    fixture.detectChanges();

    expect(updateFormSpy).not.toHaveBeenCalled();
  }));

  it('should load type options', fakeAsync(() => {
    MockFormService.getOpportunityDictionary.and.returnValue(Observable.of({
      procurement_type: [
        {
          code: 'o',
          elementId: 'o',
          value: 'Solicitation',
        }
      ]
    }));

    comp['loadTypeOptions']();
    tick();
    expect(comp.oppTypeConfig.options.length).toBeGreaterThan(0);
  }));

  it('should save office', fakeAsync(() => {
    let office = 'testOfficeId';
    comp['saveOffice'](office);
    expect(comp.viewModel.office).toEqual(office);

    let officeObj = {orgKey: 'testOrgKey'};
    comp['saveOffice'](officeObj);
    expect(comp.viewModel.office).toEqual(officeObj.orgKey);

    let nullObj = null;
    comp['saveOffice'](nullObj);
    expect(comp.viewModel.office).toEqual(nullObj);
  }));

  it('should save opportunityType', fakeAsync(() => {
    let type = 'o';
    comp['saveOpportunityType'](type);
    expect(comp.viewModel.opportunityType).toEqual(type);
  }));

  it('should save procurementId', fakeAsync(() => {
    let id = 'testId';
    comp['saveProcurementId'](id);
    expect(comp.viewModel.procurementId).toEqual(id);
  }));

  it('should save title', fakeAsync(() => {
    let title = 'Test Title';
    comp['saveTitle'](title);
    expect(comp.viewModel.title).toEqual(title);
  }));
});
