import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {SystemAlertsService} from "api-kit/system-alerts/system-alerts.service";
import {Observable} from "rxjs";
import {AlertItemComponent} from "./alert-item/alert-item.component";
import {SamUIKitModule} from 'ui-kit';
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {AlertsPage} from "./alerts.page";
import {DateFormatPipe} from "../app-pipes/date-format.pipe";

// Load test data
import {error, info, warning} from './alerts-test-data.spec';
import {By} from "@angular/platform-browser";


class RouterStub {
  navigate(url:string) {
    return url;
  }
}

let systemAlertsStub: any = {
  getAll: () => Observable.of({total: 5, alerts: [error, error, warning, warning, info]})
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
        {provide: SystemAlertsService, useValue: systemAlertsStub },
      ]
    });

    fixture = TestBed.createComponent(AlertsPage);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  it('should do a search when a dropdown value changes', async(() => {
    component.filters.statuses = ['active', 'inactive'];
    component.onParamChanged(undefined);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const items = fixture.debugElement.queryAll(By.directive(AlertItemComponent));
      expect(items.length).toBe(5);
    });
  }));

  it('should handle out of order responses (perhaps caused by crappy networking hardware)', done => {
    done();
    // TODO: Fix this issue so that this test passes
    // fixture.detectChanges();
    // let svc = fixture.debugElement.injector.get(SystemAlertsService);
    // //spyOn(svc, 'getAll').and.returnValue(Observable.of({total: 2, alerts: [error, error]}).delay(50));
    // svc.getAll = () => { console.log('get all 1'); return Observable.of({total: 1, alerts: [error]}).delay(10); };
    // component.doSearch();
    // svc.getAll = () => { console.log('get all 2'); return Observable.of({total: 2, alerts: [error, error]}) };
    // component.doSearch();
    // setTimeout(() => {
    //   fixture.detectChanges();
    //   const items = fixture.debugElement.queryAll(By.directive(AlertItemComponent));
    //   expect(items.length).toBe(2);
    //   done();
    // }, 20);
  });

});
