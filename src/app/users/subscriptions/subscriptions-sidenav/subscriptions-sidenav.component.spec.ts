import { TestBed, async } from '@angular/core/testing';
import { SubscriptionsSideNavComponent } from "./subscriptions-sidenav.component";
import { SamUIKitModule } from "sam-ui-kit/index";
import { FormsModule } from "@angular/forms";
import { SamAPIKitModule } from "../../../../api-kit/api-kit.module";
import { AppComponentsModule } from "../../../app-components/app-components.module";
import { SamErrorService } from "../../../../api-kit/error-service/error.service";
import { RouterTestingModule } from "@angular/router/testing";

describe('SubscriptionsSideNav Component', () => {
  let fixture, component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubscriptionsSideNavComponent,
      ],
      imports: [
        SamUIKitModule,
        FormsModule,
        SamAPIKitModule,
        AppComponentsModule,
        RouterTestingModule,
      ],
      providers: [
        SamErrorService,
      ]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SubscriptionsSideNavComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should emit changes to subscribers on filter changes', () => {
    component.ngOnInit();
    const filterSpy = spyOn(component.filterChange, 'emit');
    component.subscriptionFilterOptionChange();
    expect(filterSpy).toHaveBeenCalled();
  });

});
