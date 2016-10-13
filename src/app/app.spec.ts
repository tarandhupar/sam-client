import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router } from '@angular/router';

// Load the implementations that should be tested
import { App } from './app.component';

class RouterStub {
  navigate(url: string) { return url; }
}


describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      App,
      { provide: Router, useClass: RouterStub }
    ]
  }));

  it('should have a test value', inject([ App ], (app) => {
    // expect(app.testValue.value).toEqual('Test');
    // app.ngOnInit();
    // expect(app.testValue.value).toEqual('Test' );
  }));

});
