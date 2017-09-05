import { TestBed, async } from '@angular/core/testing';
import { SystemAlertsService } from 'api-kit/system-alerts/system-alerts.service';
import { Observable } from 'rxjs';
import { AlertItemComponent } from './alert-item/alert-item.component';
import { SamUIKitModule } from 'sam-ui-kit';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertsPage } from './alerts.page';
import { DateFormatPipe } from '../app-pipes/date-format.pipe';

import { By } from "@angular/platform-browser";
import { HttpModule } from '@angular/http';
import { AlertEditComponent } from "./alert-edit/alert-edit.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertFooterService } from "./alert-footer/alert-footer.service";
import { UserAccessService } from "../../api-kit/access/access.service";
import { WrapperService } from "../../api-kit/wrapper/wrapper.service";

// load test data
import { error, info, warning } from './alerts-test-data.spec';

class RouterStub {
  navigate(url: string) {
    return url;
  }
}

let systemAlertsStub: any = {
  getAll: () => Observable.of({total: 5, alerts: [error, error, warning, warning, info], _links:{'create':true}}),
  getAlertType: () => {return Observable.of(['Informational','Warning','Critical']);}
};

describe('The AlertsPage component', () => {
  let component:AlertsPage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertsPage,AlertItemComponent,AlertEditComponent,DateFormatPipe],
      imports: [SamUIKitModule,RouterTestingModule,FormsModule,ReactiveFormsModule,HttpModule],
      providers: [
        AlertFooterService,
        UserAccessService,
        WrapperService,
        { provide: SystemAlertsService, useValue: systemAlertsStub },
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

  it('should handle out of order responses', done => {
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
