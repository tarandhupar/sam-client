import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamButtonComponent} from './sam-button.component';
import {SamAngularModule} from '../../sam-angular';

describe('The Sam Button component', () => {
  let component:SamButtonComponent;
  let fixture:any;

  let defaultBtnConfig = {type: 'default', labelName: 'defaultBtn', labelData: 'Default'};
  let altBtnConfig = {type: 'alt', labelName: 'altBtn', labelData: 'Alt'};
  let secondaryBtnConfig = {type: 'secondary', labelName: 'secondaryBtn', labelData: 'Secondary'};
  let grayBtnConfig = {type: 'gray', labelName: 'grayBtn', labelData: 'Gray'};
  let outlineBtnConfig = {type: 'outline', labelName: 'outlineBtn', labelData: 'Outline'};
  let invertedBtnConfig = {type: 'inverted', labelName: 'invertedBtn', labelData: 'Inverted'};
  let disabledBtnConfig = {type: 'disabled', labelName: 'disabledBtn', labelData: 'Disabled'};
  let bigBtnConfig = {type: 'big', labelName: 'bigBtn', labelData: 'Big'};

  let samBtnErrorConfig = {type: 'notExist', labelName: 'errorConfigBtn', labelData: 'Wrong Type'};


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamButtonComponent],
      imports: [SamAngularModule]
    });

    fixture = TestBed.createComponent(SamButtonComponent);
    component = fixture.componentInstance;

  });

  it('should display a default sam button', function () {

    component.type = defaultBtnConfig.type;
    component.labelName = defaultBtnConfig.labelName;
    component.labelData = defaultBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#defaultBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Default");
  });

  it('should display a alt sam button', function () {

    component.type = altBtnConfig.type;
    component.labelName = altBtnConfig.labelName;
    component.labelData = altBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-primary-alt");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#altBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Alt");
  });

  it('should display a secondary sam button', function () {

    component.type = secondaryBtnConfig.type;
    component.labelName = secondaryBtnConfig.labelName;
    component.labelData = secondaryBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-secondary");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#secondaryBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Secondary");
  });

  it('should display a gray sam button', function () {

    component.type = grayBtnConfig.type;
    component.labelName = grayBtnConfig.labelName;
    component.labelData = grayBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-gray");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#grayBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Gray");
  });

  it('should display a outline sam button', function () {

    component.type = outlineBtnConfig.type;
    component.labelName = outlineBtnConfig.labelName;
    component.labelData = outlineBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-outline");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#outlineBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Outline");
  });

  it('should display a inverted sam button', function () {

    component.type = invertedBtnConfig.type;
    component.labelName = invertedBtnConfig.labelName;
    component.labelData = invertedBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-outline-inverse");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#invertedBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Inverted");
  });

  it('should display a disabled sam button', function () {

    component.type = disabledBtnConfig.type;
    component.labelName = disabledBtnConfig.labelName;
    component.labelData = disabledBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-disabled");
    expect(component.disabled).toBe(true);
    let btnElement = fixture.debugElement.query(By.css("#disabledBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Disabled");
  });

  it('should display a big sam button', function () {

    component.type = bigBtnConfig.type;
    component.labelName = bigBtnConfig.labelName;
    component.labelData = bigBtnConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-big");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#bigBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Big");
  });

  it('should display a default sam button when the type is not valid', function () {

    component.type = samBtnErrorConfig.type;
    component.labelName = samBtnErrorConfig.labelName;
    component.labelData = samBtnErrorConfig.labelData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#errorConfigBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Wrong Type");
  });
});
