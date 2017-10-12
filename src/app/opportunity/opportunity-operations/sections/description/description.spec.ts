import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {SideNavComponent} from "../../../../assistance-listing/assistance-listing-operations/navigation/side-nav.component";
import {AppComponentsModule} from "../../../../app-components/app-components.module";
import {SamUIKitModule} from "sam-ui-kit/index";
import {OpportunityFormModule} from "../../opportunity-form.module";
import {OpportunityFormViewModel} from "../../framework/data-model/opportunity-form/opportunity-form.model";
import {OpportunityDescriptionComponent} from "./description.component";
import {Observable} from "rxjs";
import {OpportunityService} from "../../../../../api-kit/opportunity/opportunity.service";
import {DictionaryService} from "../../../../../api-kit/dictionary/dictionary.service";
let MockFormService = jasmine.createSpyObj('MockFormService', ['getOpportunityDictionary']);
MockFormService.getOpportunityDictionary.and.returnValue(Observable.of({}));

describe('Opportunities Description Form', () => {
  let comp: OpportunityDescriptionComponent;
  let fixture: ComponentFixture<OpportunityDescriptionComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SideNavComponent
      ],
      providers: [
        DictionaryService
      ],
      imports: [
        AppComponentsModule,
        OpportunityFormModule,
        RouterTestingModule,
        SamUIKitModule,
        ReactiveFormsModule,
      ]
    }).overrideComponent(OpportunityDescriptionComponent, {
      set: {
        providers: [
          {provide: OpportunityService, useValue: MockFormService},
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityDescriptionComponent);
    comp = fixture.componentInstance;
    comp.viewModel = new OpportunityFormViewModel({});
    fixture.detectChanges();
  });
  it('should exist', () => {
    expect(comp).toBeDefined();
    expect(comp.oppDescForm.controls['description']).toBeDefined();
  });

  it('should update viewmodel', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let descriptionSpy = spyOnProperty(comp.viewModel, 'description', 'set');

    comp.updateViewModel({
      description: 'Test'
    });

    expect(descriptionSpy).toHaveBeenCalled();

  });

  it('should update form', () => {
    // todo: need to udpate @types/jasmine to 2.5.53 for spyOnProperty to be recognized
    // @types/jasmine 2.5.53 depends on Typescript 2.1+ depends on Angular 4+
    let descriptionSpy = spyOnProperty(comp.viewModel, 'description', 'get');
    comp.updateForm();
    expect(descriptionSpy).toHaveBeenCalled();
  });
});

