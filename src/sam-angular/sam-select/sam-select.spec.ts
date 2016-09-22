import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamSelectComponent } from './sam-select.component';
import { SamAngularModule } from '../../sam-angular';

describe('The Sam Select component', () => {
  let component: SamSelectComponent;
  let fixture: any;

  let options = [
    {value: 1, label: 'one'},
    {value: 2, label: 'two'},
    {value: 3, label: 'three'}
  ];

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamSelectComponent],
      imports: [SamAngularModule]
    });

    fixture = TestBed.createComponent(SamSelectComponent);
    component = fixture.componentInstance;
  });

  it('should display 3 options if 3 options are specified by the config', function () {
    component.config = {options: options};
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('option').length).toBe(options.length);
  });

  it('should display 4 options if there is a placeholder', function () {
    component.config = {options: options, placeholder: 'Select an option'};
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('option').length).toBe(options.length + 1);
  });

  it('should display 4 options if there is an empty option', function () {
    component.config = {options: options, hasEmptyOption: true};
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('option').length).toBe(options.length + 1);
  });

  it('should display 5 options if there is a placeholder and an empty options', function () {
    component.config = {options: options, hasEmptyOption: true, placeholder: 'placeholder'};
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('option').length).toBe(options.length + 2);
  });

  it('should allow an initial value to be set by the model input', async(() => {
    component.config = {options: options};
    component.model = 2;
    fixture.detectChanges();
    setTimeout(() => {
      let selectElement = fixture.nativeElement.getElementsByTagName('select')[0];
      expect(selectElement.selectedIndex).toBe(1);
    });
  }));

  it('should show a hint message', function () {
    let hint = "Life pro tip: eat vegetables";
    component.config = {hint: hint};
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(hint);
  });

  it('should show an error message', function () {
    let errorMessage = "Uh-oh, something went wrong";
    component.config = {errorMessage: errorMessage};
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
  });

  it('should show a label', function () {
    let labelText = "Pick from the following options";
    component.config = {label: labelText};
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(labelText);
  });

  it('should disable the dropdown', async(() => {
    component.config = {options: options, disabled: true};
    fixture.detectChanges();
    setTimeout(() => {
      let selectElement = fixture.nativeElement.getElementsByTagName('select')[0];
      expect(selectElement.disabled).toBe(true);
    });
  }));
});
