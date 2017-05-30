import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { SearchReportComponent } from "./search-report.component";
import { WorkspaceModule } from "../workspace.module";


describe('Workspace search and report component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:SearchReportComponent;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule, WorkspaceModule ],
      providers: []
    });
    fixture = TestBed.createComponent(SearchReportComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should toggle correct help detail', () => {
    fixture.detectChanges();
    component.toggleHelpDetail('searches',true);
    expect(component.helpDetailType).toBe('searches');
  });
});
