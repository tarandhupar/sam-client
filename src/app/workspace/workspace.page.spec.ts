import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { WorkspacePage } from "./workspace.page";
import { WorkspaceModule } from "./workspace.module";


class RouterStub {
  navigate(url: string) { return url; }
}


describe('Workspace Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:WorkspacePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule,
        WorkspaceModule
      ],
      providers: [
        WorkspacePage,
        { provide: ActivatedRoute, useValue: {'queryParams': Observable.of({ 'user': '6'})}},
      ]
    });
    fixture = TestBed.createComponent(WorkspacePage);
    component = fixture.componentInstance;
  });

  it("should compile without error", inject([ WorkspacePage ], () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  }));

  it("should have correct toggle feature object for data entry", inject([ WorkspacePage ], () => {
    fixture.detectChanges();
    component.userProfile = 'f-ng-na';
    component.userAccessTokens = component.userProfile.split('-');
    component.setDataEntryWidgetControl();
    expect(component.dataEntryWidgetControl).toEqual({entity:false,exclusions:false,award:false,opportunities:false,assistanceListings:false,subAward:false});
  }));

  it("should have correct toggle feature object for administration", inject([ WorkspacePage ], () => {
    fixture.detectChanges();
    component.userProfile = 'f-ng-na';
    component.userAccessTokens = component.userProfile.split('-');
    component.setAdministrationWidgetControl();
    expect(component.administrationWidgetControl).toEqual({profile:true,fh:false,rm:false,aacRequest:false,alerts:false,analytics:false});

  }));
});
