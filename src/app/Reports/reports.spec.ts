import {
  inject,
  TestBed
} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {IAMService} from 'api-kit';
import {ReportsPage} from "./reports.page";


class RouterStub {
  navigate(url: string) { return url; }
}

describe('Reports Page', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      IAMService,
      ReportsPage,
      { provide: Router, useClass: RouterStub }
    ]
  }));

  it('should compile without error', inject([ ReportsPage ], () => {
    expect(true).toBe(true);
  }));


});
