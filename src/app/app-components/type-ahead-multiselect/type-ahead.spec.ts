import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Load the implementations that should be tested
import {SamUIKitModule} from "../../../sam-ui-elements/src/ui-kit/index";

import {SamTypeAheadComponent} from "./type-ahead.component";
import {AutocompleteConfig} from "../../../sam-ui-elements/src/ui-kit/types";

describe('The Sam Type-ahead Component', () => {
  let component: SamTypeAheadComponent;
  let fixture: ComponentFixture<SamTypeAheadComponent>;

  // Autocomplete Dropdown With Button
  let name: string = 'Type-ahead-multiselect';
  let id: string = '1234';
  let placeholder: string = 'Test';
  let selectedLabel: string = "Selected Test";
  let options: any = [
    { label: 'Alaska', value: 'AK'},
    { label: 'Alabama', value: 'AL'},
    { label: 'New York', value: 'NY'},
    { label: 'Virginia', value: 'VA'},
  ];
  let config: AutocompleteConfig = {
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    }
  };
  let allowAny = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamTypeAheadComponent ],
      imports: [
        CommonModule,
        FormsModule,
        SamUIKitModule
      ],
    });

    fixture = TestBed.createComponent(SamTypeAheadComponent);
    component = fixture.componentInstance;
    component.name = name;
    component.id = id;
    component.placeholder = placeholder;
    component.selectedLabel = selectedLabel;
    component.options = options;
    component.config = config;
    component.allowAny = allowAny;
  });

  it('Should have an input', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeDefined();
  });

  it('Should have list for options', () => {
    component.hasFocus = true;
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('#sam-autocomplete-results'));
    expect(list).toBeDefined();
  });

  it('Should display only given value in list', () => {
    component.hasFocus = true;
    fixture.detectChanges();
    component.filteredKeyValuePairs = component.filterKeyValuePairs('Alaska', component.options);
    expect(component.filteredKeyValuePairs).toEqual([{ label: 'Alaska', value: 'AK'}]);
  });

  it('Should display selected value in listDisplay', () => {
    component.hasFocus = true;
    component.setSelectedList({ label: 'Alabama', value: 'AL'});
    component.setSelectedList({ label: 'Alaska', value: 'AK'});
    fixture.detectChanges();
    expect(component.listDisplay.selectedItems[0]).toEqual("Alabama");
    expect(component.listDisplay.selectedItems).toContain("Alaska");
  });
});
