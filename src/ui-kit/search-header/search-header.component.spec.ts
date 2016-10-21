import { TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import { SamSearchHeaderComponent } from './search-header.component';
import {SamUIKitModule} from "ui-kit";


describe('The Sam Header component', () => {
  let component: SamSearchHeaderComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule,RouterTestingModule],
      providers: [SamSearchHeaderComponent],
    });
    fixture = TestBed.createComponent(SamSearchHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

});
