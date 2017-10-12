import { inject, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { WorkspaceWidgetComponent } from "./workspace-widget.component";


xdescribe('Workspace widget component', () => {
  // provide our implementations or mocks to the dependency injector
  let component:WorkspaceWidgetComponent;
  let fixture:any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceWidgetComponent],
      imports:[ SamUIKitModule, SamAPIKitModule,  ReactiveFormsModule, FormsModule, RouterTestingModule, AppComponentsModule ],
      providers: []
    });
    fixture = TestBed.createComponent(WorkspaceWidgetComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should be able to emit toggle detail event', () => {
    fixture.detectChanges();
    component.onToggleBtnClick();
    expect(component.isExpand).toBeTruthy();
  })
});
