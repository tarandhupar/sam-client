import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs';

import {WorkspacePage} from './workspace.page';
import {ProgramService, SamAPIKitModule} from 'api-kit';
import {SamUIKitModule} from 'ui-kit';
import {AppComponentsModule} from '../app-components/app-components.module';
import {AssistanceProgramResult} from '../federal-assistance-program/program-result/assistance-program-result.component';

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


describe('WorkspacePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkspacePage, AssistanceProgramResult],
      providers: [],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        AppComponentsModule,
        RouterTestingModule.withRoutes([
          {path: 'workspace', component: WorkspacePage}
        ])
      ]
    }).overrideComponent(WorkspacePage, {
      set: {
        providers: [
          {provide: ProgramService, useValue: workspaceServiceStub}
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspacePage);
  });

  it('should "run" a search', () => {
    fixture.componentInstance.runProgram();
      expect(fixture.componentInstance.data[0].data.title).toBe("Yukon River Salmon Research and Management Assistance");
  });
});

