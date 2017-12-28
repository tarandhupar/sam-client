// Angular Imports
import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router } from '@angular/router';

// SAM Imports
import { HomePage } from './home.page';
import { AppState } from 'app/app.service';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';
import { RouterTestingModule } from '@angular/router/testing';


let comp;
let fixture;

class RouterStub {
  navigate(url: string) { return url; }
}

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePage,
        
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'home', component: HomePage}
        ])
      ]
      ,
      providers: [
        AppState,
        FeedbackFormService,
      ],
    });

    fixture = TestBed.createComponent(HomePage);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile without error', () => {
    expect(true).toBe(true);
  });
  it('should initialize feedback to form service instance', () => {
    expect(comp.feedback).toEqual(comp.formService.componentInstance);
  });

});
