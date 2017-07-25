import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { DataEntryComponent } from "./data-entry.component";
import { WorkspaceModule } from "../workspace.module";
import { ProgramService } from "../../../api-kit/program/program.service";


describe('Workspace data entry component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:DataEntryComponent;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule, WorkspaceModule ],
      providers: [ ProgramService ]
    });
    fixture = TestBed.createComponent(DataEntryComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    component.toggleControl = {entity:true,exclusions:true,award:true,opportunities:true,assistanceListings:true,subAward:true};
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should toggle correct help detail', () => {
    component.toggleControl = {entity:true,exclusions:true,award:true,opportunities:true,assistanceListings:true,subAward:true};
    fixture.detectChanges();
    component.toggleHelpDetail('entity',true,1);
    expect(component.isDetailExpanded(1)).toBeTruthy();
  });

});
