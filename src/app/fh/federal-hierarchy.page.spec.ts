import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { FederalHierarchyPage } from "./federal-hierarchy.page";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FHService } from "../../api-kit/fh/fh.service";
import { FHSideNav } from "./fh-sidenav/fh-sidenav.component";
import { OrgCreatePage } from '../organization-detail/create-org/create-org.component';

class RouterStub {
  navigate(url: string) { return url; }
}

class FHServiceStub {

};

describe('Federal Hierarchy Page', () => {
  // provide our implementations or mocks to the dependency injector

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[FederalHierarchyPage,FHSideNav],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        RouterTestingModule,
      ],
      providers: [
        FederalHierarchyPage,
        { provide: FHService ,useClass:FHServiceStub}
      ]
    });

  });

  it('should compile without error', inject([ FederalHierarchyPage ], () => {
    expect(true).toBe(true);
  }));



});
