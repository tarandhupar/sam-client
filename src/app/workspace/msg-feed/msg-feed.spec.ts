import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { MsgFeedComponent } from "./msg-feed.component";
import { MsgFeedSideNavComponent } from "./msg-feed-sidenav/msg-feed-sidenav.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { MsgFeedService } from "api-kit/msg-feed/msg-feed.service";
import { MsgFeedServiceMock } from "api-kit/msg-feed/msg-feed.mock";
// import { AppTemplatesModule } from "../../app-templates/index";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
  },
  params: Observable.of({section:"requests",subsection:"sent"})

};

xdescribe('Message Feeds Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:MsgFeedComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[MsgFeedComponent,MsgFeedSideNavComponent],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        RouterTestingModule,
        // AppTemplatesModule,
        AppComponentsModule,
      ],
      providers: [
        MsgFeedComponent,
        CapitalizePipe,
        { provide: MsgFeedService ,useClass:MsgFeedServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub},
      ]
    });
    fixture = TestBed.createComponent(MsgFeedComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', inject([ MsgFeedComponent ], () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  }));

});
