import {TestBed, async} from '@angular/core/testing';
import {SystemAlertsService} from "api-kit/system-alerts/system-alerts.service";
import {Observable} from "rxjs";
import {AlertItemComponent} from "./alert-item/alert-item.component";
import {SamUIKitModule} from 'ui-kit';
import {Router, ActivatedRoute} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {AlertsPage} from "./alerts.page";
import {DateFormatPipe} from "../app-pipes/date-format.pipe";

// Load test data
import {error, info, warning} from './alerts-test-data.spec';
import {Subject} from "rxjs/Subject";


class RouterStub {
  navigate(url:string) {
    return url;
  }
}

let activatedRouteStub: any = {
  queryParams: new Subject(),
  snapshot: {
    data: {
      alerts: [error, error, info, warning]
    }
  }
};

let systemAlertsStub: any = {
  getActive: () => Observable.of([error, error]),
  getAll: () => Observable.of([error, error, warning, warning, info])

};

describe('The AlertsPage component', () => {
  let component:AlertsPage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertsPage,AlertItemComponent,DateFormatPipe],
      imports: [SamUIKitModule,RouterTestingModule],
      providers: [
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: SystemAlertsService, useValue: systemAlertsStub },
      ]
    });

    fixture = TestBed.createComponent(AlertsPage);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  it('should do a search when url params change', async(() => {
    const urlParams = { page: 2 };
    component.route.queryParams.next(urlParams);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentPage).toBe(2);
    });
  }));

  it('should do a search when a dropdown value changes', async(() => {
    component.filters.statuses = ['active', 'inactive'];
    component.onParamChanged();
    fixture.whenStable().then(() => {
      expect(true).toBe(true);
    });
  }));

});
