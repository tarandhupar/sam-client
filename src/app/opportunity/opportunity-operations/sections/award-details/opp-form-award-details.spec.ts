import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityFormService } from '../../framework/service/opportunity-form/opportunity-form.service';
import { OpportunityAwardDetailsComponent } from './opp-form-award-details.component';
import { OppNoticeTypeMapService } from "../../framework/service/notice-type-map/notice-type-map.service";
import { OpportunitySideNavService } from '../../framework/service/sidenav/opportunity-form-sidenav.service';

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

describe('Opportunity Award Details Form', () => {
  let comp: OpportunityAwardDetailsComponent;
  let fixture: ComponentFixture<OpportunityAwardDetailsComponent>;
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
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        OpportunityAwardDetailsComponent,
      ],
      providers: [
        {provide: OpportunityFormService, useValue: MockFormService},
        {provide: ActivatedRoute, useValue: MockActivatedRoute},
        OppNoticeTypeMapService,
        OpportunitySideNavService
      ],
      imports: [
        SamUIKitModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityAwardDetailsComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new OpportunityFormViewModel({});
    comp.oppAwardDetailsViewModel = comp.viewModel.oppAwardDetailsViewModel;
  });

  it('should exist', fakeAsync(() => {
    //let createFormStub = spyOn(comp, 'createForm').and.stub();
    //let updateFormSpy = spyOn(comp, 'updateForm').and.stub();
    //let subscribeChangesSpy = spyOn(comp, 'subscribeToChanges').and.stub();
    //fixture.detectChanges();
    expect(comp).toBeDefined();
    //expect(createFormStub).toHaveBeenCalled();
    //expect(updateFormSpy).not.toHaveBeenCalled();
    //expect(subscribeChangesSpy).toHaveBeenCalled();
  }));

  it('should load existing data on edit page', fakeAsync(() => {
    comp.viewModel = new OpportunityFormViewModel({id: '12345'});
    let updateFormSpy = spyOn(comp, 'updateForm');
    fixture.detectChanges();
    expect(updateFormSpy).toHaveBeenCalled();
  }));

  it('should not load existing data on add page', fakeAsync(() => {
    let updateFormSpy = spyOn(comp, 'updateForm');
    fixture.detectChanges();
    expect(updateFormSpy).not.toHaveBeenCalled();
  }));

  it('form needs to be defined after createForm call', fakeAsync(() => {
    comp['createForm']();
    fixture.detectChanges();
    expect(comp.oppAwardDetailsForm).toBeDefined();
  }));

  it('subscribeToChanges calls linkControlTo', () => {
    let linkControlToSpy = spyOn(comp, 'linkControlTo');
    fixture.detectChanges();
    expect(linkControlToSpy).toHaveBeenCalled();
  });

  it('saveAwardNumber should save award number', () => {
    comp['saveAwardNumber']('123');
    fixture.detectChanges();
    expect(comp.oppAwardDetailsViewModel.awardNumber).toEqual('123');
  });

  it('saveAmount should save dollar amount number', () => {
    comp['saveAmount'](123);
    fixture.detectChanges();
    expect(comp.oppAwardDetailsViewModel.amount).toEqual(123);
  });

  it('saveLineItemNumber should save line item number', () => {
    comp['saveLineItemNumber'](123);
    fixture.detectChanges();
    expect(comp.oppAwardDetailsViewModel.lineItemNumber).toEqual(123);
  });

  it('saveDeliveryOrderNumber should save delivery order number', () => {
    comp['saveDeliveryOrderNumber']('123');
    fixture.detectChanges();
    expect(comp.oppAwardDetailsViewModel.deliveryOrderNumber).toEqual('123');
  });

  it('saveAwardeeDuns should save duns number', () => {
    comp['saveAwardeeDuns']('123');
    fixture.detectChanges();
    expect(comp.oppAwardDetailsViewModel.awardeeDuns).toEqual('123');
  });

  it('saveAwardeeName should save duns name', () => {
    comp['saveAwardeeName']('test');
    fixture.detectChanges();
    expect(comp.oppAwardDetailsViewModel.awardeeName).toEqual('test');
  });
  it('saveAwardDate should save duns Date', () => {
    comp['saveAwardDate']('12-03-2009');
    fixture.detectChanges();
    expect(comp.oppAwardDetailsViewModel.awardDate).toEqual('12-03-2009');
  });

});
