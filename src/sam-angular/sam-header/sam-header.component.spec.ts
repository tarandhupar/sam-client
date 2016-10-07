import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamHeaderComponent } from './sam-header.component';

describe('The Sam Header component', () => {
  let component: SamHeaderComponent;
  let fixture: any;

  let model = ['ma'];

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
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
