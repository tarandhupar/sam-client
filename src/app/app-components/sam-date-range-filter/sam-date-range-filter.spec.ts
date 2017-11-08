import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamDateRangeFilterComponent } from './sam-date-range-filter.component';

describe('The Sam Footer component', () => {
  let component: SamDateRangeFilterComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamDateRangeFilterComponent ],
      imports: [ SamUIKitModule, RouterTestingModule,FormsModule ]
    });

    fixture = TestBed.createComponent(SamDateRangeFilterComponent);
    component = fixture.componentInstance;
  });

  it('should compile sam date range filter', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
