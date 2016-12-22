import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamDateEntryComponent } from './time.component';
import { SamUIKitModule } from 'ui-kit';

describe('The Sam Date Entry component', () => {
  let component: SamDateEntryComponent;
  let fixture: any;

  let model = {
    month: 12,
    day: 31,
    year: 2016
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamDateEntryComponent],
    });

    fixture = TestBed.createComponent(SamDateEntryComponent);
    component = fixture.componentInstance;
    component.model = model;
  });

  it('Date Check', function () {
    fixture.detectChanges();
    //console.log(component.model,fixture.nativeElement.querySelector('#date_1').getAttribute("ng-reflect-model"));
    expect(fixture.nativeElement.querySelector('#date_1').getAttribute("ng-reflect-model")).toBe("12");//month
    expect(fixture.nativeElement.querySelector('#date_2').getAttribute("ng-reflect-model")).toBe("31");//day
    expect(fixture.nativeElement.querySelector('#date_3').getAttribute("ng-reflect-model")).toBe("2016");//year
  });
});
