import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { MsgFeedSideNavComponent } from "./msg-feed-sidenav.component";
import { AppComponentsModule } from "../../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { MsgFeedServiceMock } from "api-kit/msg-feed/msg-feed.mock";

xdescribe('Message Feeds page sidenav component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:MsgFeedSideNavComponent;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ MsgFeedSideNavComponent],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
        {provide: MsgFeedService, useClass: MsgFeedServiceMock},
      ]
    });
    fixture = TestBed.createComponent(MsgFeedSideNavComponent);
    component = fixture.componentInstance;
  });

  it('should have correct fields set for requests feeds page', done => {
    component.curSection = "Requests";
    fixture.detectChanges();
    component.filterChange.subscribe(data => {
      expect(data).toEqual({
        keyword:"",
        requestType:[],
        status:[],
        alertType:[],
        domains:[],
        section:"requests",
        subSection:"sent",
      });
      done();
    });

    component.onSectionTabClick('requests/sent');

  });

});
