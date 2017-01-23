import {
  inject,
  TestBed
} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {ReportsPage} from "./reports.page";


class RouterStub {
  navigate(url: string) { return url; }
}

fdescribe('Reports Page', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ReportsPage,
      { provide: Router, useClass: RouterStub }
    ]
  }));

  it('should compile without error', inject([ ReportsPage ], () => {
    expect(true).toBe(true);
  }));


});
