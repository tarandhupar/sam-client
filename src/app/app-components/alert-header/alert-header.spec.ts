import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import {AlertHeaderComponent} from './alert-header.component';
import {SystemAlertsService} from "api-kit";
import {SamUIKitModule} from 'ui-kit';
import {RouterTestingModule} from "@angular/router/testing";

let error = {
  "title" : "The is an error", 
  "summary" : "The systems will be down for a while", 
  "category" : "outages", 
  "description" : "This is the description", 
  "severity" : "ERROR",
  "begins" : "2016-11-01T20:03:09Z",
  "expires" : "2016-11-01T20:03:09Z",
  "published" : "2016-11-01T20:03:09Z" 
};

let warning = {
  "title" : "The is an warning",
  "summary" : "The systems will be slow for a while",
  "category" : "outages",
  "description" : "This is the description",
  "severity" : "WARNING",
  "begins" : "2016-11-01T20:03:09Z",
  "expires" : "2016-11-01T20:03:09Z",
  "published" : "2016-11-01T20:03:09Z"
};

let info = {
  "title" : "The is information",
  "summary" : "The systems will have additional features tomorrow",
  "category" : "features",
  "description" : "This is the description",
  "severity" : "INFO",
  "begins" : "2016-11-01T20:03:09Z",
  "expires" : "2016-11-01T20:03:09Z",
  "published" : "2016-11-01T20:03:09Z"
};

let noAlerts = Observable.of([]);
let oneAlert = Observable.of([error]);
let fiveAlerts = Observable.of([error, error, warning, info, info]);

let systemAlertsStub: any = {
  getAll: () => fiveAlerts
};

describe('The AlertList component', () => {
  let component:AlertHeaderComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertHeaderComponent],
      imports: [SamUIKitModule,RouterTestingModule],
      providers: [
        { provide: SystemAlertsService, useValue: systemAlertsStub },
      ]
    });

    fixture = TestBed.createComponent(AlertHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should check for alerts every X minutes', () => {
    // TODO: implement me
  });

  it('should show 0 alerts', done => {
    let svc = fixture.debugElement.injector.get(SystemAlertsService);
    spyOn(svc, 'getAll').and.returnValue(noAlerts);

    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.textContent.trim()).toBe('');
      done();
    });
  });

  it('should show 1 alert', done => {
    let svc = fixture.debugElement.injector.get(SystemAlertsService);
    spyOn(svc, 'getAll').and.returnValue(oneAlert);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let alerts = fixture.debugElement.queryAll(By.css('.usa-alert'));
      expect(alerts.length).toBe(1);
      done();
    });
  });
});
