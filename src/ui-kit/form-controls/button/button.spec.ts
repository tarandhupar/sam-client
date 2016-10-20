import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamButtonComponent} from './button.component';
import {SamUIKitModule} from '../../ui-kit.module';

describe('The Sam Button component', () => {
  let component:SamButtonComponent;
  let fixture:any;

  let defaultBtnConfig = {type: 'default', buttonId: 'defaultBtn', buttonData: 'Default'};
  let altBtnConfig = {type: 'alt', buttonId: 'altBtn', buttonData: 'Alt'};
  let secondaryBtnConfig = {type: 'secondary', buttonId: 'secondaryBtn', buttonData: 'Secondary'};
  let grayBtnConfig = {type: 'gray', buttonId: 'grayBtn', buttonData: 'Gray'};
  let outlineBtnConfig = {type: 'outline', buttonId: 'outlineBtn', buttonData: 'Outline'};
  let invertedBtnConfig = {type: 'inverted', buttonId: 'invertedBtn', buttonData: 'Inverted'};
  let disabledBtnConfig = {type: 'disabled', buttonId: 'disabledBtn', buttonData: 'Disabled'};
  let bigBtnConfig = {type: 'big', buttonId: 'bigBtn', buttonData: 'Big'};

  let samBtnErrorConfig = {type: 'notExist', buttonId: 'errorConfigBtn', buttonData: 'Wrong Type'};


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamButtonComponent],
      imports: [SamUIKitModule]
    });

    fixture = TestBed.createComponent(SamButtonComponent);
    component = fixture.componentInstance;

  });

  it('should display a default sam button', function () {

    component.type = defaultBtnConfig.type;
    component.buttonId = defaultBtnConfig.buttonId;
    component.buttonData = defaultBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#defaultBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Default");
  });

  it('should display a alt sam button', function () {

    component.type = altBtnConfig.type;
    component.buttonId = altBtnConfig.buttonId;
    component.buttonData = altBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-primary-alt");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#altBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Alt");
  });

  it('should display a secondary sam button', function () {

    component.type = secondaryBtnConfig.type;
    component.buttonId = secondaryBtnConfig.buttonId;
    component.buttonData = secondaryBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-secondary");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#secondaryBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Secondary");
  });

  it('should display a gray sam button', function () {

    component.type = grayBtnConfig.type;
    component.buttonId = grayBtnConfig.buttonId;
    component.buttonData = grayBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-gray");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#grayBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Gray");
  });

  it('should display a outline sam button', function () {

    component.type = outlineBtnConfig.type;
    component.buttonId = outlineBtnConfig.buttonId;
    component.buttonData = outlineBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-outline");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#outlineBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Outline");
  });

  it('should display a inverted sam button', function () {

    component.type = invertedBtnConfig.type;
    component.buttonId = invertedBtnConfig.buttonId;
    component.buttonData = invertedBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-outline-inverse");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#invertedBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Inverted");
  });

  it('should display a disabled sam button', function () {

    component.type = disabledBtnConfig.type;
    component.buttonId = disabledBtnConfig.buttonId;
    component.buttonData = disabledBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-disabled");
    expect(component.disabled).toBe(true);
    let btnElement = fixture.debugElement.query(By.css("#disabledBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Disabled");
  });

  it('should display a big sam button', function () {

    component.type = bigBtnConfig.type;
    component.buttonId = bigBtnConfig.buttonId;
    component.buttonData = bigBtnConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-big");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#bigBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Big");
  });

  it('should display a default sam button when the type is not valid', function () {

    component.type = samBtnErrorConfig.type;
    component.buttonId = samBtnErrorConfig.buttonId;
    component.buttonData = samBtnErrorConfig.buttonData;
    fixture.detectChanges();

    expect(component.btnClass).toBe("");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#errorConfigBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Wrong Type");
  });
});
