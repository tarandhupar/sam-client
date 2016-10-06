import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamDropdownComponent } from './sam-dropdown.component';
import { SamAngularModule } from '../../sam-angular';

describe('The Sam Dropdown component', () => {
  let component: SamDropdownComponent;
  let fixture: any;

  let options = [
    {value: 'dc', label: 'Washington DC', name: 'dc'},
    {value: 'ma', label: 'Maryland', name: 'maryland'},
    {value: 'va', label: 'Virginia', name: 'virginia'},
  ];

  let defaultConfig = {
    options: options,
    label: 'I am a checkbox',
    name: 'i-am-a-checkbox',
  };

  let model = 'ma';

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamDropdownComponent],
      imports: [SamAngularModule]
    });

    fixture = TestBed.createComponent(SamDropdownComponent);
    component = fixture.componentInstance;
    component.options = defaultConfig.options;
  });

  it('should display 3 checkboxes if 3 options are specified by the config', function () {
    fixture.detectChanges();
    let options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(3);
  });

});
