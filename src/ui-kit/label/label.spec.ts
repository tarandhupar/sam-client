import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamLabelComponent} from './label.component.ts';
import {SamUIKitModule} from '../ui-kit.module';

describe('The Sam Label component', () => {
  let component:SamLabelComponent;
  let fixture:any;

  let smallLabelConfig = {
    labelType: 'small',
    labelId: 'smallLabel',
    labelData: 'test small'
  };

  let bigLabelConfig = {
    labelType: 'big',
    labelId: 'bigLabel',
    labelData: 'test big'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamLabelComponent],
      imports: [SamUIKitModule]
    });

    fixture = TestBed.createComponent(SamLabelComponent);
    component = fixture.componentInstance;

  });

  it('should display a small sam label', function () {

    component.labelType = smallLabelConfig.labelType;
    component.labelId = smallLabelConfig.labelId;
    component.labelData = smallLabelConfig.labelData;
    fixture.detectChanges();

    expect(component.labelClass).toBe('usa-label');
    let labelElement = fixture.debugElement.query(By.css("#smallLabel"));
    expect(labelElement.nativeElement.innerHTML).toBe("test small");


  });

  it('should display a big sam label', function () {
    component.labelType = bigLabelConfig.labelType;
    component.labelId = bigLabelConfig.labelId;
    component.labelData = bigLabelConfig.labelData;
    fixture.detectChanges();

    expect(component.labelClass).toBe('usa-label-big');
    let labelElement = fixture.debugElement.query(By.css("#bigLabel"));
    expect(labelElement.nativeElement.innerHTML).toBe("test big");
  });


});
