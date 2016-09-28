import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  let model = ['ma'];

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
    console.log(fixture.debugElement.queryAll(By.css('input')).length);
    let selectAllElement = fixture.nativeElement.getElementsByTagName('input')[0];
    selectAllElement.click();
    fixture.detectChanges();
    setTimeout(() => {
      expect(component.model).toEqual(['dc', 'ma', 'va']);
    });
  }));

  it('should deselect all elements if select all is checked twice', async(() => {
    component.config = {options: options, name: 'test', hasSelectAll: true};
    fixture.detectChanges();
    let selectAllElement = fixture.nativeElement.getElementsByTagName('input')[0];
    selectAllElement.click();
    fixture.detectChanges();
    selectAllElement.click();
    fixture.detectChanges();
    setTimeout(() => {
      expect(component.model).toEqual([]);
    });
  }));

  it('should allow an initial value to be set by the model input', async(() => {
    component.config = {options: options, name: 'test'};
    component.model = ['ma'];
    fixture.detectChanges();
    setTimeout(() => {
      let inputs = fixture.debugElement.queryAll(By.css(':checked'));
      expect(inputs.length).toEqual(1);
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
