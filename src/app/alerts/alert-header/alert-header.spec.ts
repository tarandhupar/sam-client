import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {  By  } from '@angular/platform-browser';

// Load the implementations that should be tested
import { AlertHeaderComponent } from './alert-header.component';
import { SystemAlertsService } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-kit';
import { RouterTestingModule } from '@angular/router/testing';

// Load test data
import { error, info, warning } from '../alerts-test-data.spec';

let noAlerts = Observable.of([]);
let fiveAlerts = Observable.of([error, error, warning, info, info]);

let systemAlertsStub: any = {
  getActive: () => fiveAlerts
};

describe('The AlertHeader component', () => {
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
    spyOn(svc, 'getActive').and.returnValue(noAlerts);

    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.textContent.trim()).toBe('');
      done();
    });
  });

  it('should show an error', done => {
    let svc = fixture.debugElement.injector.get(SystemAlertsService);
    spyOn(svc, 'getActive').and.returnValue(Observable.of([error]));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let alerts = fixture.debugElement.queryAll(By.css('h3'));
      expect(alerts.length).toBe(1);
      done();
    });
  });

  it('should show a warning', done => {
    let svc = fixture.debugElement.injector.get(SystemAlertsService);
    spyOn(svc, 'getActive').and.returnValue(Observable.of([warning]));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let alerts = fixture.debugElement.queryAll(By.css('h3'));
      expect(alerts.length).toBe(1);
      done();
    });
  });

  it('should show an info', done => {
    let svc = fixture.debugElement.injector.get(SystemAlertsService);
    spyOn(svc, 'getActive').and.returnValue(Observable.of([info]));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let alerts = fixture.debugElement.queryAll(By.css('h3'));
      expect(alerts.length).toBe(1);
      done();
    });
  });

  it('should show 2 alert (even if the services returns 5)', done => {
    let svc = fixture.debugElement.injector.get(SystemAlertsService);
    spyOn(svc, 'getActive').and.returnValue(fiveAlerts);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let alerts = fixture.debugElement.queryAll(By.css('h3'));
      expect(alerts.length).toBe(2);
      done();
    });
  });
});
