import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { AdministrationComponent } from "./administration.component";
import { WorkspaceModule } from "../workspace.module";


fdescribe('Workspace administration component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:AdministrationComponent;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule, WorkspaceModule ],
      providers: []
    });
    fixture = TestBed.createComponent(AdministrationComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    component.toggleControl = {profile:true,fh:true,rm:true,aacRequest:true,alerts:true,analytics:true};
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should toggle correct help detail', () => {
    component.toggleControl = {profile:true,fh:true,rm:true,aacRequest:true,alerts:true,analytics:true};
    fixture.detectChanges();
    component.toggleHelpDetail('profile',true,0);
    expect(component.isDetailExpanded(0)).toBeTruthy();
  });

});
