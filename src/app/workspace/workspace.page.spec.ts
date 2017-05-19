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


class RouterStub {
  navigate(url: string) { return url; }
}


describe('Organization Detail Page', () => {
  // provide our implementations or mocks to the dependency injector
  
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
        { provide: Router, useClass: RouterStub },
      ]
    });

  });

  it('should compile without error', inject([ OrgDetailPage ], () => {
    expect(true).toBe(true);
  }));



});
