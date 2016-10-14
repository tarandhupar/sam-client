import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import { App } from './app.component';
import {ROUTES} from "./app.routes";
import {Home} from "./home/home.component";
import {Search} from "./search/search.component";
import {SamAngularModule} from "../sam-angular/sam-angular.module";



class RouterStub {
  navigate(url: string) { return url; }
}


describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    declarations:[Home,Search],
    imports: [SamAngularModule, RouterTestingModule.withRoutes(ROUTES)],
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
