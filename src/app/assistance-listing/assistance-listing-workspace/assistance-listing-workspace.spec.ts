import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {ProgramService, SamAPIKitModule} from 'api-kit';
import {SamUIKitModule} from 'sam-ui-kit';
import {AppComponentsModule} from '../../app-components/app-components.module';
import { AssistanceProgramResult } from './program-result/assistance-program-result.component';
import { FalWorkspacePage } from './assistance-listing-workspace.page';
import {SamAutocompleteComponent} from "../../../sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.component";
import {FALWrapperChangeRequestDropdownComponent} from "../components/change-request-dropdown/wrapper-change-request-dropdown.component";
import {FALChangeRequestDropdownComponent} from "../components/change-request-dropdown/change-request-dropdown.component";
import {RequestLabelPipe} from "../pipes/request-label.pipe";
import { PageTemplateComponent } from "../../app-templates/page.component";



var fixture;

var workspaceServiceStub = {
  runProgram: () => {
    return Observable.of({
      _embedded: {
        program: [{
          "data": {
            "title": "Yukon River Salmon Research and Management Assistance",
            "programNumber": "15.671",
            "organizationId": '1'
          },
          "status": {
            "code": "published",
            "value": "Published"
          }
        }],
      },
      page: {
        size: 10,
        totalElements: 123,
        totalPages: 123,
        number: 0
      }
    });
  }
};


xdescribe('FalWorkspacePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FalWorkspacePage, PageTemplateComponent, AssistanceProgramResult,FALWrapperChangeRequestDropdownComponent,FALChangeRequestDropdownComponent,RequestLabelPipe],
      providers: [],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        ReactiveFormsModule,
        AppComponentsModule,
        RouterTestingModule.withRoutes([
          {path: 'falworkspace', component: FalWorkspacePage}
        ])
      ]
    }).overrideComponent(FalWorkspacePage, {
      set: {
        providers: [
          {provide: ProgramService, useValue: workspaceServiceStub}
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(FalWorkspacePage);
  });

  it('should "run" a search', () => {
    fixture.componentInstance.runProgram();
    expect(fixture.componentInstance.data[0].data.title).toBe("Yukon River Salmon Research and Management Assistance");
  });
});

