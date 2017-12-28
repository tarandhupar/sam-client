import {
  inject,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from "@angular/router/testing";

import * as Cookies from 'js-cookie';
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { WorkspaceModule } from "../../workspace.module";

import { IAMService } from '../../../../api-kit/iam/iam.service';
import { CbaWidgetComponent } from './cba-widget.component';

let component: CbaWidgetComponent;
let fixture: ComponentFixture<CbaWidgetComponent>;

describe('Workspace Page: Contract Opportunity Widget', () => {
  let api: IAMService;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        WorkspaceModule,
        RouterTestingModule,
      ],
      providers: [
        IAMService,
        CbaWidgetComponent
      ]
    });

    fixture = TestBed.createComponent(CbaWidgetComponent);
    component = fixture.componentInstance;
    api = TestBed.get(IAMService);
    api.iam.user.gov = true;
    fixture.detectChanges();
  });

  it('should initialize data without error', () => {
    component.ngOnInit();
    expect(component).toBeDefined();
    expect(component.isLinkActive).toEqual(false);
  });

  it('toggleClass should toggle isLinkActive value', () => {
    component.toggleClass(true);
    expect(component.isLinkActive).toEqual(true);
  });
});
