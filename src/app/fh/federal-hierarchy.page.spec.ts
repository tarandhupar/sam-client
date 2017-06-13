import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { FederalHierarchyPage } from "./federal-hierarchy.page";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FHService } from "../../api-kit/fh/fh.service";


class RouterStub {
  navigate(url: string) { return url; }
}

class FHServiceStub {

};

describe('Federal Hierarchy Page', () => {
  // provide our implementations or mocks to the dependency injector

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[FederalHierarchyPage],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule,
      ],
      providers: [
        FederalHierarchyPage,
        { provide: Router, useClass: RouterStub },
        { provide: FHService ,useClass:FHServiceStub}
      ]
    });

  });

  it('should compile without error', inject([ FederalHierarchyPage ], () => {
    expect(true).toBe(true);
  }));



});
