import { TestBed, async } from '@angular/core/testing';

import { SamUIKitModule } from "sam-ui-kit";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SamAPIKitModule } from "../../../api-kit/api-kit.module";
import { SubscriptionsComponent } from "./subscriptions.component";
import { WatchlistService } from "../../../api-kit/watchlist/watchlist.service";
import { WatchlistServiceMock } from "../../../api-kit/watchlist/watchlist.service.mock";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SubscriptionsSideNavComponent } from "./subscriptions-sidenav/subscriptions-sidenav.component";
import { AppTemplatesModule } from "../../app-templates/index";
import { RouterTestingModule } from "@angular/router/testing";
import { SamErrorService } from "../../../api-kit/error-service/error.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";

describe('Subscriptions Component', () => {
  let fixture, component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubscriptionsSideNavComponent,
        SubscriptionsComponent,
      ],
      imports: [
        SamUIKitModule,
        FormsModule,
        ReactiveFormsModule,
        SamAPIKitModule,
        AppComponentsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: WatchlistService, useClass: WatchlistServiceMock },
        SamErrorService,
        CapitalizePipe,
      ]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SubscriptionsComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should run filters', () => {
    component.ngOnInit();
    const filterSpy = spyOn(component, 'loadSubscriptions');
    component.onFilterChange({
      keyword:"",
      feedType:[],
      frequency:[],
      domains:[],
    });
    component.onSortSelectModelChange();
    component.onPageNumChange(1);
    expect(filterSpy).toHaveBeenCalledTimes(3);
  });

});
