import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location, LocationStrategy } from '@angular/common';

// Load the implementations that should be tested
import {HelpPage} from "./help.page";


class RouterStub {
  navigate(url: string) { return url; }
}

class LocationStub{
  path(val: boolean) { return "/help/overview"; }
}

describe('Help Page', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    imports:[RouterTestingModule],
    providers: [
      HelpPage,
      { provide: Router, useClass: RouterStub },
      { provide: Location, useClass: LocationStub }
    ]
  }));

  it('should compile without error', inject([ HelpPage ], () => {
    expect(true).toBe(true);
  }));


});
