import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamSelectComponent } from './sam-select.component';
import { SamAngularModule } from '../../sam-angular';

describe('The Sam Select component', () => {
  let component: SamSelectComponent;
  let fixture: any;

  let options = [
    {value: 1, label: 'one', name: 'one'},
    {value: 2, label: 'two', name: 'two'},
    {value: 3, label: 'three', name: 'three'}
  ];

  let defaultConfig = {
    options: options,
    label: 'select',
    name: 'my-select',
  };

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
    component.config = defaultConfig;
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('option').length).toBe(options.length);
  });

  it('should allow an initial value to be set by the model input', async(() => {
    component.config = defaultConfig;
    component.model = 2;
    fixture.detectChanges();
    setTimeout(() => {
      let selectElement = fixture.nativeElement.getElementsByTagName('select')[0];
      expect(selectElement.selectedIndex).toBe(1);
    });
  }));

  it('should show a hint message', function () {
    let hint = "Life pro tip: eat vegetables";
    component.config = defaultConfig;
    component.config.wrapper.hint = hint;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(hint);
  });

  it('should show an error message', function () {
    let errorMessage = "Uh-oh, something went wrong";
    component.config = defaultConfig;
    component.config.wrapper.errorMessage = errorMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
  });

  it('should show a label', function () {
    let labelText = "Pick from the following options";
    component.config = defaultConfig;
    component.config.wrapper.label = labelText;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(labelText);
  });

  it('should disable the dropdown', async(() => {
    component.config = defaultConfig;
    component.config.disabled = true;
    fixture.detectChanges();
    setTimeout(() => {
      let selectElement = fixture.nativeElement.getElementsByTagName('select')[0];
      expect(selectElement.disabled).toBe(true);
    });
  }));
});
