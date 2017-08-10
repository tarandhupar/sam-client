import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { OrgDetailPage } from "./organization-detail.page";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FHService } from "../../api-kit/fh/fh.service";
import { FHServiceMock } from "../../api-kit/fh/fh.service.mock";
import { FlashMsgService } from "./flash-msg-service/flash-message.service";
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
  },
  params: Observable.of({orgId: "100000121"})

};

describe('Organization Detail Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:OrgDetailPage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[OrgDetailPage],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule,
      ],
      providers: [
        OrgDetailPage,
        FlashMsgService,
        CapitalizePipe,
        { provide: ActivatedRoute, useValue: activatedRouteStub},
        { provide: FHService ,useClass:FHServiceMock}
      ]
    });

    fixture = TestBed.createComponent(OrgDetailPage);
    component = fixture.componentInstance;
  });

  it('should compile without error', inject([ OrgDetailPage ], () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  }));



});
