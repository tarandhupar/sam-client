import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityFormService } from '../../framework/service/opportunity-form/opportunity-form.service';
import { OpportunityHeaderInfoComponent } from './opp-form-header-info.component';
import {UserAccessService} from "../../../../../api-kit/access/access.service";
import {UserService} from "../../../../role-management/user.service";

let MockActivatedRoute = {
  snapshot: {
    params: {
      id: jasmine.createSpy('id')
    },
    url: {
      path: jasmine.createSpy('path')
    },
    _routeConfig: {
      path: jasmine.createSpy('path')
    }
  },
  data: {
    subscribe: jasmine.createSpy('subscribe')
  },
  fragment: {
    subscribe: jasmine.createSpy('subscribe')
  }

};

describe('Opportunity Header Info Form', () => {
  let comp: OpportunityHeaderInfoComponent;
  let fixture: ComponentFixture<OpportunityHeaderInfoComponent>;
  let MockFormService = jasmine.createSpyObj('MockFormService', ['getOpportunityDictionary']);
  let MockUserAccessService = jasmine.createSpyObj('MockUserAccessService', ['getAllUserRoles']);
  let MockUserService = jasmine.createSpyObj('MockUserService', ['getUser']);

  let _opp = {
    id: '123',
    _links: {
      'opportunity:create': "",
      'opportunity:edit': ""
    }
  };

  MockActivatedRoute.snapshot.params.id.and.returnValue('123');
  MockActivatedRoute.data.subscribe.and.returnValue(Observable.of(_opp));
  MockActivatedRoute.snapshot.url.path.and.returnValue(Observable.of('opp/123/edit'));
  MockActivatedRoute.snapshot._routeConfig.path.and.returnValue(Observable.of('opp/123/edit'));
  MockActivatedRoute.fragment.subscribe.and.returnValue(Observable.of(null));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        OpportunityHeaderInfoComponent,
      ],
      providers: [
        { provide: OpportunityFormService, useValue: MockFormService },
        { provide: UserAccessService, useValue: MockUserAccessService },
        { provide: UserService, useValue: MockUserService },
        { provide: ActivatedRoute, useValue: MockActivatedRoute },
      ],
      imports: [
        SamUIKitModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityHeaderInfoComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new OpportunityFormViewModel({});
    comp.oppHeaderInfoViewModel = comp.viewModel.oppHeaderInfoViewModel;
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
    spyOn(comp, 'initFHDropdown').and.stub();
    fixture.detectChanges();

    expect(updateFormSpy).not.toHaveBeenCalled();
  }));

  it('should load initFHDropdown on add page', fakeAsync(() => {
    let initFHDropdownSpy = spyOn(comp, 'initFHDropdown');
    spyOn(comp, 'loadTypeOptions').and.stub();
    fixture.detectChanges();

    expect(initFHDropdownSpy).toHaveBeenCalled();
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
    expect(comp.oppHeaderInfoViewModel.office).toEqual(office);

    let officeObj = {orgKey: 'testOrgKey'};
    comp['saveOffice'](officeObj);
    expect(comp.oppHeaderInfoViewModel.office).toEqual(officeObj.orgKey);

    let nullObj = null;
    comp['saveOffice'](nullObj);
    expect(comp.oppHeaderInfoViewModel.office).toEqual(nullObj);
  }));

  it('should save opportunityType', fakeAsync(() => {
    let type = 'o';
    comp['saveOpportunityType'](type);
    expect(comp.oppHeaderInfoViewModel.opportunityType).toEqual(type);
  }));

  it('should save procurementId', fakeAsync(() => {
    let id = 'testId';
    comp['saveProcurementId'](id);
    expect(comp.oppHeaderInfoViewModel.procurementId).toEqual(id);
  }));

  it('should save title', fakeAsync(() => {
    let title = 'Test Title';
    comp['saveTitle'](title);
    expect(comp.viewModel.title).toEqual(title);
  }));
});