import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { FHSideNav } from "./fh-sidenav.component";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";


describe('FH landing page sidenav component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:FHSideNav;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ FHSideNav],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: [
      ]
    });
    fixture = TestBed.createComponent(FHSideNav);
    component = fixture.componentInstance;
  });

  it('should have correct fields set for org status and type', done => {
    fixture.detectChanges();
    component.orgStatusChange.subscribe(data => {
      expect(data).toBe('inactive');
      done();
    });
    component.orgStatusCbxModel = "inactive";
    component.orgSearchStatusChange('inactive');
  });

});
