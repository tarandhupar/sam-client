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
          _type: "data",
          title: "Dummy Result 1"
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


fdescribe('WorkspacePage', () => {
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
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.data.results[0].title).toBe("Dummy Result 1");
    });
  });

  it('should "run" a featured search', () => {
    fixture.componentInstance.keyword = "test";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.runProgram();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.featuredData.featuredResult[0].name).toBe("SAMPLE NAME");
    });
  });

});

