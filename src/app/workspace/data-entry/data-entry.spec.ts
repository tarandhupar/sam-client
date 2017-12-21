import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule, DictionaryService } from "api-kit";
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
      providers: [ ProgramService, DictionaryService ]
    });
    fixture = TestBed.createComponent(DataEntryComponent);
    component = fixture.componentInstance;
    component.toggleControl = {entity:true,exclusions:true,award:true,opportunities:true,assistanceListings:true,subAward:true};
    fixture.detectChanges();
  });

  it('should compile without error', () => {
    expect(true).toBe(true);
  });

  it('makeObj returns json object', () => {
    let jsonObj = component.makeObj('opportunities');
    expect(Object.keys(jsonObj).length).toBeGreaterThan(0);
  });

  it('setHelpNavigation returns json object', () => {
    let jsonObj = component.setHelpNavigation('opportunities');
    expect(Object.keys(jsonObj).length).toBeGreaterThan(0);
  });
});
