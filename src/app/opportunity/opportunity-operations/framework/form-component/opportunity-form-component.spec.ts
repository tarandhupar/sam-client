import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SamUIKitModule } from 'sam-ui-kit/index';
import { AppComponentsModule } from '../../../../app-components/app-components.module';
import { OppComponentsModule } from '../../../components/index';
import { ReactiveFormsModule } from '@angular/forms';
import { DictionaryService } from '../../../../../api-kit/dictionary/dictionary.service';
import { AlertFooterService } from '../../../../app-components/alert-footer/alert-footer.service';
import { OpportunityAuthGuard } from '../../../components/authgaurd/authguard.service';
import { Observable } from 'rxjs/Rx';
import { OpportunityFormComponent } from './opportunity-form.component';
import { OpportunityFormService } from '../service/opportunity-form.service';
import { OpportunityFormViewModel } from '../data-model/opportunity-form.model';
import { OpportunityHeaderInfoComponent } from '../../sections/header-information/opp-form-header-info.component';
import { OpportunitySectionNames } from '../data-model/opportunity-form-constants';

//let MockFormService = jasmine.createSpyObj('MockFormService', []);
let MockAuthGaurd = jasmine.createSpyObj('MockAuthGaurd', ['canActivate', 'checkPermissions']);
MockAuthGaurd.canActivate.and.returnValue(true);

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

describe('Opportunity Form Component', () => {
  let comp: OpportunityFormComponent;
  let fixture: ComponentFixture<OpportunityFormComponent>;

  let _opp = {
    id: '123'
  };
  MockActivatedRoute.snapshot.params.id.and.returnValue('123');
  MockActivatedRoute.data.subscribe.and.returnValue(Observable.of(_opp));
  MockActivatedRoute.snapshot.url.path.and.returnValue(Observable.of('opportunities/123/edit'));
  MockActivatedRoute.snapshot._routeConfig.path.and.returnValue(Observable.of('opportunities/123/edit'));
  MockActivatedRoute.fragment.subscribe.and.returnValue(Observable.of(null));

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        OpportunityFormComponent,
        OpportunityHeaderInfoComponent
      ],
      providers: [
        OpportunityFormService,
        DictionaryService,
        AlertFooterService,
        { provide: ActivatedRoute, useValue: MockActivatedRoute },
        { provide: OpportunityAuthGuard, useValue: MockAuthGaurd }
      ],
      imports: [
        AppComponentsModule,
        OppComponentsModule,
        RouterTestingModule,
        SamUIKitModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityFormComponent);
    comp = fixture.componentInstance;
    comp.oppFormViewModel = new OpportunityFormViewModel({});
    fixture.detectChanges();
  });

  it('Opportunity form component should exist', () => {
    expect(comp).toBeDefined();
  });

  it('determineLogin should return true', () => {
    expect(comp.determineLogin()).toBe(true);
  });

  it('gotoSection should return header-information', () => {
    comp.gotoSection(OpportunitySectionNames.HEADER_INFORMATION);
    expect(comp.currentSection).toEqual(0);
  });

  it('isSection should return true', () => {
    comp.currentSection = 0;
    expect(comp.isSection(OpportunitySectionNames.HEADER_INFORMATION)).toBe(true);
  });

  it('isSection should return false', () => {
    comp.currentSection = 1;
    expect(comp.isSection(OpportunitySectionNames.HEADER_INFORMATION)).toBe(false);
  });

  it('formActionHandler calls function onSaveExitClick', () => {
    let obj = {
      event : 'done'
    };
    let spyData = spyOn(comp, 'onSaveExitClick');
    comp.formActionHandler(obj);
    expect(spyData).toHaveBeenCalled();
  });

  it('formActionHandler calls function onSaveBackClick', () => {
    let obj = {
      event : 'back'
    };
    let spyData = spyOn(comp, 'onSaveBackClick');
    comp.formActionHandler(obj);
    expect(spyData).toHaveBeenCalled();
  });

  it('formActionHandler calls function onSaveContinueClick', () => {
    let obj = {
      event : 'next'
    };
    let spyData = spyOn(comp, 'onSaveContinueClick');
    comp.formActionHandler(obj);
    expect(spyData).toHaveBeenCalled();
  });

  it('formActionHandler calls function onCancelClick', () => {
    let obj = {
      event : 'cancel'
    };
    let spyData = spyOn(comp, 'onCancelClick');
    comp.formActionHandler(obj);
    expect(spyData).toHaveBeenCalled();
  });

  it('onSaveExitClick saveForm is called with SaveExit parameter', () => {
    let spyData = spyOn(comp, 'saveForm');
    comp.onSaveExitClick();
    expect(spyData).toHaveBeenCalledWith('SaveExit');
  });

  it('onSaveBackClick saveForm is called with SaveBack parameter', () => {
    let spyData = spyOn(comp, 'saveForm');
    comp.onSaveBackClick();
    expect(spyData).toHaveBeenCalledWith('SaveBack');
  });

  it('onSaveContinueClick saveForm is called with SaveContinue parameter', () => {
    let spyData = spyOn(comp, 'saveForm');
    comp.onSaveContinueClick();
    expect(spyData).toHaveBeenCalledWith('SaveContinue');
  });

  it('onCancelClick cancel is called', () => {
    let spyData = spyOn(comp, 'cancel');
    comp.onCancelClick();
    expect(spyData).toHaveBeenCalled();
  });

  it('gotoNextSection updates currentSection to 1', () => {
    comp.currentSection = 0;
    comp.gotoNextSection();
    expect(comp.currentSection).toEqual(1);
  });

  it('gotoPreviousSection updates currentSection to 0', () => {
    comp.currentSection = 1;
    comp.gotoPreviousSection();
    expect(comp.currentSection).toEqual(0);
  });

  it('tabsClicked Authenticated tab onSaveExitClick called', () =>{
    let spyData = spyOn(comp, 'onSaveExitClick');
    let obj = {
      label: 'Authenticated'
    };
    comp.tabsClicked(obj);
    expect(spyData).toHaveBeenCalled();
  });

  it('tabsClicked Public tab onViewClick called', () =>{
    let spyData = spyOn(comp, 'onViewClick');
    let obj = {
      label: 'Public'
    };
    comp.tabsClicked(obj);
    expect(spyData).toHaveBeenCalled();
  });

});
