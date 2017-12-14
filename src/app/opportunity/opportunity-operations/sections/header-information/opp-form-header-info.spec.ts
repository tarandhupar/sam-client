import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityFormService } from '../../framework/service/opportunity-form/opportunity-form.service';
import { OpportunityHeaderInfoComponent } from './opp-form-header-info.component';
import { UserAccessService } from "../../../../../api-kit/access/access.service";
import { UserService } from "../../../../role-management/user.service";
import { IAMService } from '../../../../../api-kit/iam/iam.service';
import { OppNoticeTypeMapService } from '../../framework/service/notice-type-map/notice-type-map.service';
import { OpportunitySideNavService } from '../../framework/service/sidenav/opportunity-form-sidenav.service';
import { OpportunityFormErrorService } from '../../opportunity-form-error.service';

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
  let MockOppNoticeTypeMapService = jasmine.createSpyObj('MockOppNoticeTypeMapService', ['toggleSectionsDisabledProperty']);
  let MockErrorService = jasmine.createSpyObj('MockErrorService', ['validateHeaderTitle', 'validateFederalAgency', 'validateProcurementId', 'applicableErrors']);


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
        IAMService,
        { provide: OpportunityFormErrorService, useValue: MockErrorService},
        { provide: OppNoticeTypeMapService, useValue: MockOppNoticeTypeMapService },
        OpportunitySideNavService,
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
        },
        {
          "elementId": "p",
          "code": "p",
          "value": "Presolicitation"
        },
        {
          "elementId": "k",
          "code": "k",
          "value": "Combined Synopsis/Solicitation",
        },
        {
          "elementId": "r",
          "code": "r",
          "value": "Sources Sought",
        },
        {
          "elementId": "g",
          "code": "g",
          "value": "Sale of Surplus Property",
        },
        {
          "elementId": "s",
          "code": "s",
          "value": "Special Notice"
        }
      ]
    }));

    comp['loadTypeOptions']();
    tick();
    expect(comp.oppTypeConfig.options.length).toBeGreaterThan(0);
    expect(comp.oppTypeConfig.options).toContain(jasmine.objectContaining({value: 'o', label: 'Solicitation'}));
    expect(comp.oppTypeConfig.options).toContain(jasmine.objectContaining({value: 'p', label: 'Presolicitation'}));
    expect(comp.oppTypeConfig.options).toContain(jasmine.objectContaining({value: 'k', label: 'Combined Synopsis/Solicitation'}));
    expect(comp.oppTypeConfig.options).toContain(jasmine.objectContaining({value: 'r', label: 'Sources Sought'}));
    expect(comp.oppTypeConfig.options).toContain(jasmine.objectContaining({value: 'g', label: 'Sale of Surplus Property'}));
    expect(comp.oppTypeConfig.options).toContain(jasmine.objectContaining({value: 's', label: 'Special Notice'}));
  }));

  xit('should save office', fakeAsync(() => {
    fixture.detectChanges();

    let office = 'testOfficeId';
    let errorSpy = spyOn(comp, 'updateFederalAgencyError');
    comp['saveOffice'](office);
    expect(comp.oppHeaderInfoViewModel.office).toEqual(office);

    let officeObj = {orgKey: 'testOrgKey'};
    comp['saveOffice'](officeObj);
    expect(comp.oppHeaderInfoViewModel.office).toEqual(officeObj.orgKey);

    let nullObj = null;
    comp['saveOffice'](nullObj);
    expect(comp.oppHeaderInfoViewModel.office).toEqual(nullObj);

    expect(errorSpy).toHaveBeenCalled();
  }));

  it('should save opportunityType', fakeAsync(() => {
    let type = 'o';
    let disableSideNavSpy = spyOn(comp, 'disableSideNavItem');
    comp['saveOpportunityType'](type);
    expect(comp.oppHeaderInfoViewModel.opportunityType).toEqual(type);
    expect(disableSideNavSpy).toHaveBeenCalled();
  }));

  xit('should save procurementId', fakeAsync(() => {
    fixture.detectChanges();
    let id = 'testId';
    comp['saveProcurementId'](id);
    expect(comp.oppHeaderInfoViewModel.procurementId).toEqual(id);
  }));

  xit('should save title', fakeAsync(() => {
    fixture.detectChanges();
    let errorSpy = spyOn(comp, 'updateTitleError');
    let title = 'Test Title';
    comp['saveTitle'](title);
    expect(comp.viewModel.title).toEqual(title);
    fixture.detectChanges();
    expect(errorSpy).toHaveBeenCalled();
  }));

  it('should save related notice', fakeAsync(() => {
    let related = '123';
    comp['saveRelatedNotice'](related);
    expect(comp.viewModel.relatedNotice).toEqual(related);
  }));

  it('disableSideNavItem should do service call', fakeAsync(() => {
    comp['disableSideNavItem']('o');
    expect(MockOppNoticeTypeMapService.toggleSectionsDisabledProperty).toHaveBeenCalled();
  }));

});
