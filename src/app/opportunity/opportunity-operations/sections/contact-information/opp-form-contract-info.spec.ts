import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityContactInfoComponent } from './opp-form-contact-info.component';

describe('Opportunity Contact Information Form', () => {
  let comp: OpportunityContactInfoComponent;
  let fixture: ComponentFixture<OpportunityContactInfoComponent>;

  // todo: improve test coverage
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        OpportunityContactInfoComponent,
      ],
      providers: [
      ],
      imports: [
        SamUIKitModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityContactInfoComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new OpportunityFormViewModel({});
  });

  it('should exist', () => {
    fixture.detectChanges();
    expect(comp).toBeDefined();
    expect(comp.oppContactInfoForm).toBeDefined();
    expect(comp.primaryPOCState).toEqual(comp.states.START);
    expect(comp.secondaryPOCState).toEqual(comp.states.START);
  });

  it('should load existing data', fakeAsync(() => {
    comp.viewModel = new OpportunityFormViewModel({id: '12345'});
    let loadFormSpy = spyOn(comp, 'loadForm').and.callThrough();
    let contactActionSpy = spyOn(comp, 'onContactAction');
    let loadPOCSpy = spyOn(comp, 'loadPOC').and.callFake(
      (type) => {
        if (type === comp.pocConfig.primary.type) {
          return null;
        } else {
          return {fullName: 'test'};
        }
      }
    );

    fixture.detectChanges();

    expect(loadFormSpy).toHaveBeenCalled();
    expect(loadPOCSpy).toHaveBeenCalledTimes(2);

    // if any data was loaded, should change state of poc form
    expect(contactActionSpy).toHaveBeenCalledTimes(1);
    expect(contactActionSpy.calls.mostRecent().args).toEqual([comp.pocConfig.secondary.type, 'load']);
  }));

  it('should be able to change data using poc name', fakeAsync(() => {
    fixture.detectChanges();

    // test reference -> original
    let [control, state] = comp['getReferencesByName'](comp.pocConfig.primary.type);

    control.setValue({fullName: 'test'});
    expect(comp.primaryPOC.value).toEqual(jasmine.objectContaining({fullName: 'test'}));

    expect(state.get()).toEqual(comp.states.START);
    state.set(comp.states.ADD);
    expect(state.get()).toEqual(comp.states.ADD);
    expect(comp.primaryPOCState).toEqual(comp.states.ADD);

    // test original -> reference
    let [control2, state2] = comp['getReferencesByName'](comp.pocConfig.secondary.type);
    comp.secondaryPOC.setValue({title: 'test title'});
    expect(control2.value).toEqual(jasmine.objectContaining({title: 'test title'}));

    expect(comp.secondaryPOCState).toEqual(comp.states.START);
    comp.secondaryPOCState = comp.states.DISPLAY;
    expect(state2.get()).toEqual(comp.states.DISPLAY);
  }));

  it('should check poc state', () => {
    expect(comp.pocStateEquals(comp.pocConfig.primary.type, comp.states.START)).toEqual(true);
    comp.secondaryPOCState = comp.states.EDIT;
    expect(comp.pocStateEquals(comp.pocConfig.secondary.type, comp.states.START)).toEqual(false);
    expect(comp.pocStateEquals(comp.pocConfig.secondary.type, comp.states.EDIT)).toEqual(true);
  });

  it('should switch states', () => {
    fixture.detectChanges();
    let setValueSpy = spyOn(comp.primaryPOC, 'setValue');
    let resetSpy = spyOn(comp.primaryPOC, 'reset');

    // add new poc
    comp.onContactAction(comp.pocConfig.primary.type, 'add');
    expect(setValueSpy).toHaveBeenCalled();
    expect(comp.primaryPOCState).toEqual(comp.states.ADD);

    // cancel add
    comp.onContactAction(comp.pocConfig.primary.type, 'cancel');
    expect(comp.primaryPOCState).toEqual(comp.states.START);

    // submit new poc
    comp.onContactAction(comp.pocConfig.primary.type, 'submit');
    expect(comp.primaryPOCState).toEqual(comp.states.DISPLAY);

    // edit poc
    comp.onContactAction(comp.pocConfig.primary.type, 'edit');
    expect(comp.primaryPOCState).toEqual(comp.states.EDIT);

    // cancel edit
    comp.onContactAction(comp.pocConfig.primary.type, 'cancel');
    expect(comp.primaryPOCState).toEqual(comp.states.DISPLAY);

    // delete poc
    comp.onContactAction(comp.pocConfig.primary.type, 'delete');
    expect(resetSpy).toHaveBeenCalled();
    expect(comp.primaryPOCState).toEqual(comp.states.START);

    // load poc
    comp.onContactAction(comp.pocConfig.primary.type, 'load');
    expect(comp.primaryPOCState).toEqual(comp.states.DISPLAY);
  });

  it('should save pocs', () => {
    fixture.detectChanges();
    let viewModelSpy = spyOnProperty(comp.oppContactInfoViewModel, 'pointOfContact', 'set');

    comp.primaryPOC.setValue({
      contactId: 'test id',
      fullName: 'test name',
    });

    comp.secondaryPOC.setValue(null);

    comp['savePOC']();
    expect(viewModelSpy).toHaveBeenCalledWith([{type: comp.pocConfig.primary.type, fullName: 'test name'}]);
  });

  it('should load pocs', ()=> {
    fixture.detectChanges();
    let primarySpy = spyOnProperty(comp.oppContactInfoViewModel, 'primaryPOC', 'get');
    let secondarySpy = spyOnProperty(comp.oppContactInfoViewModel, 'secondaryPOC', 'get');

    comp['loadPOC'](comp.pocConfig.primary.type);
    expect(primarySpy).toHaveBeenCalled();
    expect(secondarySpy).not.toHaveBeenCalled();
    comp['loadPOC'](comp.pocConfig.secondary.type);
    expect(secondarySpy).toHaveBeenCalled();
  });
});

