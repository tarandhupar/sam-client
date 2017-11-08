import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { HelpContentManagementViewComponent } from "./content-management-view.component";
import { HelpContentManagementSideNavComponent } from "./sidenav/content-management-sidenav.component";
import { AppComponentsModule } from "../../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { SamAPIKitModule } from "api-kit";
import { ContentManagementService } from "api-kit/content-management/content-management.service";
import { ContentManagementServiceMock } from "api-kit/content-management/content-management.mock";
// import { AppTemplatesModule } from "../../../app-templates/index";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";

let activatedRouteStub = {
  snapshot: {
    _lastPathIndex: 0,
  },
  params: Observable.of({section:"FAQ-repository"})

};

xdescribe('Help content management Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component: HelpContentManagementViewComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[HelpContentManagementViewComponent,HelpContentManagementSideNavComponent],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        RouterTestingModule,
        // AppTemplatesModule,
        AppComponentsModule,
      ],
      providers: [
        HelpContentManagementViewComponent,
        CapitalizePipe,
        {provide: ContentManagementService, useClass: ContentManagementServiceMock},
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    });
    fixture = TestBed.createComponent(HelpContentManagementViewComponent);
    component = fixture.componentInstance;
  });

  it('should compile without error', inject([ HelpContentManagementViewComponent ], () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  }));

});
