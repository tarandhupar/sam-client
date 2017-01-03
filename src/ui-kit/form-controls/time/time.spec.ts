import { TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamTimeComponent } from './time.component';
import { SamUIKitModule } from 'ui-kit';

describe('The Sam Time component', () => {
  let component: SamTimeComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamTimeComponent],
    });

    fixture = TestBed.createComponent(SamTimeComponent);
    component = fixture.componentInstance;
    component.value = "14:44";
  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
