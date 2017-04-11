import { TestBed, ComponentFixture } from '@angular/core/testing';

// Load the implementations that should be tested
import {SamUIKitModule} from "../../../../sam-ui-elements/src/ui-kit/index";

import {SamContractTypeFilter} from "./contract-type-filter.component";
import {AppComponentsModule} from "../../../app-components/app-components.module";

describe('The Sam Contract Type Filter Component', () => {
  let component: SamContractTypeFilter;
  let fixture: ComponentFixture<SamContractTypeFilter>;

  let selectModel: string = 'AK';
  let options: any ={
    "name": "Filter Type",
    "placeholder": "Search Filter Types",
    "selectedLabel": "Codes Selected",
    "options": [
      { label: 'Alaska', value: 'AK'},
      { label: 'Alabama', value: 'AL'},
      { label: 'New York', value: 'NY'},
      { label: 'Virginia', value: 'VA'},
    ],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamContractTypeFilter ],
      imports: [
        AppComponentsModule,
        SamUIKitModule
      ]
    });

    fixture = TestBed.createComponent(SamContractTypeFilter);
    component = fixture.componentInstance;
    component.options = options;
    component.selectModel = selectModel;
    fixture.detectChanges();
  });

  // it('Should set emitted obj in selected list', () => {
  //   expect(component.selectModel).toBeDefined();
  // });

});
