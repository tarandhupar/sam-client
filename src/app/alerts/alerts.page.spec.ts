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
import { AlertFooterService } from "../app-components/alert-footer/alert-footer.service";
import { UserAccessService } from "../../api-kit/access/access.service";
import { WrapperService } from "../../api-kit/wrapper/wrapper.service";

// load test data
import { error, info, warning } from '../app-components/alert-header/alerts-test-data.spec';
import { SystemAlertsServiceMock } from "../../api-kit/system-alerts/system-alerts.service.mock";

class RouterStub {
  navigate(url: string) {
    return url;
  }
}

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
        { provide: SystemAlertsService, useClass: SystemAlertsServiceMock },
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


});
