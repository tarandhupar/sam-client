import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamLabelComponent} from './label.component.ts';
import {SamAngularModule} from '../.';

describe('The Sam Label component', () => {
  let component:SamLabelComponent;
  let fixture:any;

  let smallLabelConfig = {
    type: 'small',
    labelName: 'smallLabel',
    labelData: 'test small'
  };

  let bigLabelConfig = {
    type: 'big',
    labelName: 'bigLabel',
    labelData: 'test big'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamLabelComponent],
      imports: [SamAngularModule]
    });

    fixture = TestBed.createComponent(SamLabelComponent);
    component = fixture.componentInstance;

  });

  it('should display a small sam label', function () {

    component.type = smallLabelConfig.type;
    component.labelName = smallLabelConfig.labelName;
    component.labelData = smallLabelConfig.labelData;
    fixture.detectChanges();

    expect(component.labelClass).toBe('usa-label');
    let labelElement = fixture.debugElement.query(By.css("#smallLabel"));
    expect(labelElement.nativeElement.innerHTML).toBe("test small");


  });

  it('should display a big sam label', function () {
    component.type = bigLabelConfig.type;
    component.labelName = bigLabelConfig.labelName;
    component.labelData = bigLabelConfig.labelData;
    fixture.detectChanges();

    expect(component.labelClass).toBe('usa-label-big');
    let labelElement = fixture.debugElement.query(By.css("#bigLabel"));
    expect(labelElement.nativeElement.innerHTML).toBe("test big");
  });


});
