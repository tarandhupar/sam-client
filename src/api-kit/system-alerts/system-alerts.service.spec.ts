import { Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { SystemAlertsService, AlertType } from "./system-alerts.service";
import { TestBed, fakeAsync, inject } from "@angular/core/testing";
import { WrapperService } from "../wrapper/wrapper.service";
import { AlertFooterService } from "../../app/alerts/alert-footer/alert-footer.service";

describe('SystemAlertsService', () => {
  let basicAlert: AlertType = {
    id: 1,
    content: {
      title: 'Title',
      description: 'Description',
      expires: '11-11-2011',
      published: '11-11-2011',
      begins: '11-11-2011',
      severity: 'CRITICAL',
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SystemAlertsService,
        WrapperService,
        AlertFooterService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });
  });

  it('should provide default parameters and hit the alert endpoint', inject([SystemAlertsService, MockBackend], fakeAsync((service: SystemAlertsService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/alerts/);
    });
    service.getActive();
  })));

  it('should allow parameters to be passed in', inject([SystemAlertsService, MockBackend], fakeAsync((service: SystemAlertsService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/allAlerts/);
    });
    service.getAll(5, 5, ['p', 'i'], ['warning', 'error'], "1d", "published", 'asc');
  })));

  it('should update an alert', inject([SystemAlertsService, MockBackend], fakeAsync((service: SystemAlertsService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(connection.request.url).toMatch(/alerts/);
    });

    service.updateAlert(basicAlert);
  })));

  it('should create an alert', inject([SystemAlertsService, MockBackend], fakeAsync((service: SystemAlertsService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.url).toMatch(/alerts/);
    });
    service.createAlert(basicAlert);
  })));
});
