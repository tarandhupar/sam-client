import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { HelpContentManagementSideNavComponent } from "./content-management-sidenav.component";
import { AppComponentsModule } from "../../../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { ContentManagementServiceMock } from "api-kit/content-management/content-management.mock";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { MsgFeedServiceMock } from "api-kit/msg-feed/msg-feed.mock";

describe('Help content management page sidenav component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:HelpContentManagementSideNavComponent;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ HelpContentManagementSideNavComponent],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        {provide: ContentManagementService, useClass: ContentManagementServiceMock},
        {provide: MsgFeedService, useClass: MsgFeedServiceMock},
      ]
    });
    fixture = TestBed.createComponent(HelpContentManagementSideNavComponent);
    component = fixture.componentInstance;
  });

  it('should have correct fields set for help content management page', done => {
    component.curSection = "FAQ-repository";
    fixture.detectChanges();
    component.filterChange.subscribe(data => {
      expect(data).toEqual({
        keyword:"",
        status:[],
        domains:[],
        section:"FAQ-repository",
        subSection: "",
      });
      done();
    });

    component.onSectionTabClick('FAQ-repository');

  });

});
