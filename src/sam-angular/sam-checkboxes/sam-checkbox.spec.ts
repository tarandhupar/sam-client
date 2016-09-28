import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamCheckboxesComponent } from './sam-checkboxes.component';
import { SamAngularModule } from '../../sam-angular';

describe('The Sam Checkboxes component', () => {
  let component: SamCheckboxesComponent;
  let fixture: any;

  let options = [
    {value: 'dc', label: 'Washington DC'},
    {value: 'ma', label: 'Maryland'},
    {value: 'va', label: 'Virginia'},
  ];

  let model = {
    ma: true,
    dc: false,
    va: false
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamCheckboxesComponent],
      imports: [SamAngularModule]
    });

    fixture = TestBed.createComponent(SamCheckboxesComponent);
    component = fixture.componentInstance;
  });

  it('should display 3 checkboxes if 3 options are specified by the config', function () {
    component.config = {options: options, name: 'test'};
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('input').length).toBe(options.length);
  });

  it('should display 4 options if select all is specified', function () {
    component.config = {options: options, name: 'test', hasSelectAll: true};
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('input').length).toBe(options.length + 1);
  });

  it('should select all elements if select all is checked', async(() => {
    component.config = {options: options, name: 'test', hasSelectAll: true};
    fixture.detectChanges();
    let selectAllElement = fixture.nativeElement.getElementsByTagName('input')[0];
    selectAllElement.click();
    fixture.detectChanges();
  }));

  it('should deselect all elements if select all is checked twice', function () {
    component.config = {options: options, name: 'test', hasSelectAll: true};
    fixture.detectChanges();
    let selectAllElement = fixture.nativeElement.getElementsByTagName('input')[0];
    selectAllElement.click();
    fixture.detectChanges();
    selectAllElement.click();
    fixture.detectChanges();
    let allCheckboxes = fixture.nativeElement.getElementsByTagName('input');
    let areNoneChecked = true;
    for (let input of allCheckboxes) {
      if (input.checked) {
        areNoneChecked = false;
      }
    }
    expect(areNoneChecked).toBe(true);
  });

  it('should allow an initial value to be set by the model input', async(() => {
    component.config = {options: options, name: 'test'};
    component.model = ['ma'];
    fixture.detectChanges();
    setTimeout(() => {
      let selectedElement = fixture.nativeElement.getElementsByTagName('input')[1];
      expect(selectedElement.checked).toBe(true);
      let notSelectedElement = fixture.nativeElement.getElementsByTagName('input')[0];
      expect(notSelectedElement.checked).toBe(false);
    });
  }));

  it('should show a hint message', function () {
    let hint = "Life pro tip: eat vegetables";
    component.config = {wrapper: { hint: hint }, name: 'test', options: options};
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(hint);
  });

  it('should show an error message', function () {
    let errorMessage = "Uh-oh, something went wrong";
    component.config = {wrapper: {errorMessage: errorMessage }, name: 'test', options: options};
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
  });

  it('should show a label', function () {
    let labelText = "Pick from the following options";
    component.config = {wrapper: {label: labelText}, name: 'test', options: options};
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(labelText);
  });

});
