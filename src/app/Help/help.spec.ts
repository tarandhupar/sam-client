import {
  inject,
  TestBed
} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {HelpPage} from "./help.page";


class RouterStub {
  navigate(url: string) { return url; }
}

describe('Help Page', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HelpPage,
      { provide: Router, useClass: RouterStub }
    ]
  }));

  it('should compile without error', inject([ HelpPage ], () => {
    expect(true).toBe(true);
  }));

});
