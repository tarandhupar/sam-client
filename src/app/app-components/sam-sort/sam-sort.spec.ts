import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamSortComponent } from './sam-sort.component';

describe('The Sam Sort component', () => {
  let component: SamSortComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamSortComponent ],
      imports: [ SamUIKitModule, FormsModule ]
    });

    fixture = TestBed.createComponent(SamSortComponent);
    component = fixture.componentInstance;
  });

  it('should compile sam sort', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
