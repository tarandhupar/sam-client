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
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FHService } from "../../api-kit/fh/fh.service";
import { FHServiceMock } from "api-kit/fh/fh.service.mock";
import { FHSideNav } from "./fh-sidenav/fh-sidenav.component";

class RouterStub {
  navigate(url: string) { return url; }
}


describe('Federal Hierarchy Landing Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:FederalHierarchyPage;
  let fixture:any;

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
        { provide: FHService ,useClass:FHServiceMock}
      ]
    });
    fixture = TestBed.createComponent(FederalHierarchyPage);
    component = fixture.componentInstance;
  });

  it('should compile without error', inject([ FederalHierarchyPage ], () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  }));

  it('should be able to do a search in fh landing page', inject([ FederalHierarchyPage ], () => {
    fixture.detectChanges();
    component.searchText = "test";
    component.searchFH();
    expect(component.curPage).toBe(0);
    expect(component.totalRecords).toBe(30);
  }));

  it('should be able to set correct role based on hetoes links', inject([ FederalHierarchyPage ], () => {
    fixture.detectChanges();
    component.setUserRole({_embedded:[{org:{}},{_links:[{self:""},{link:{rel:"Sub-Tier"}}]}]});
    expect(component.userRole).toBe("deptAdmin");
    component.setUserRole({_embedded:[{org:{}},{_links:[{self:""},{link:{rel:"office"}}]}]});
    expect(component.userRole).toBe("agencyAdmin");
    component.setUserRole({_embedded:[{org:{}},{_links:[{self:""},{link:{rel:""}}]}]});
    expect(component.userRole).toBe("officeAdmin");
  }));

  it('should capable of doing admin search for current user', inject([ FederalHierarchyPage ], () => {
    fixture.detectChanges();
  }));
});
