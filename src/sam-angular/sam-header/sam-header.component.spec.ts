import { TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import { SamHeaderComponent } from './sam-header.component';
import {SamAngularModule} from "../sam-angular.module";
import {Home} from "../../app/home/home.component";


describe('The Sam Header component', () => {
  let component: SamHeaderComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[Home],
      imports: [SamAngularModule,RouterTestingModule.withRoutes([
        { path: '',      component: Home },
        { path: 'home',  component: Home }]
      )],
      providers: [SamHeaderComponent],
    });
    fixture = TestBed.createComponent(SamHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

});
