import { TestBed, async } from '@angular/core/testing';

import { SamLocationComponent } from "./location.component";
import { LocationService } from "../../../api-kit/location/location.service";
import { LocationServiceMock } from "../../../api-kit/location/location.service.mock";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SamAPIKitModule } from "../../../api-kit/api-kit.module";

describe('Location Component', () => {
  let fixture, component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SamLocationComponent,
      ],
      imports: [
        SamUIKitModule,
        FormsModule,
        ReactiveFormsModule,
        SamAPIKitModule,
      ],
      providers: [
        { provide: LocationService, useClass: LocationServiceMock },
      ]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamLocationComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should reinitialize entirely on changes to @Inputs', () => {
    component.ngOnInit();
    component.ngOnChanges();
  });

  /**
   * When state changes,
   * clear city, county and zip.
   * Populate country.
   */
  it('should clear city and county, when state changes', () => {
    component.location = {
      city: 'Tampa',
      county: 'Some County',
    };
    component.ngOnInit();
    fixture.detectChanges();
    component.store.dispatch({ type: 'STATE_CHANGE', value: 'VA' });
    expect(component.location.city).toBeFalsy();
    expect(component.location.county).toBeFalsy();
  });

  /**
   * When city changes, clear county and zip
   * since these are many-to-many relationships.
   * Populate fields for state and country.
   */
  it('should clear county and zip when city changes', () => {
    component.location = {
      zip: '12345',
      county: 'Some County',
    };
    component.ngOnInit();
    fixture.detectChanges();
    component.store.dispatch({ type: 'CITY_CHANGE', value: 'Chicago' });
    expect(component.location.zip).toBeFalsy();
    expect(component.location.county).toBeFalsy();
  });

  it('should initialize with a config', () => {
    component._cityConfig  = {name: 'city'};
    component._stateConfig  = {name: 'state'};
    component._countryConfig  = {name: 'country'};
    component._countyConfig  = {name: 'county'};
    component._zipConfig  = {name: 'zip'};
    component.ngOnInit();
    fixture.detectChanges();
  });
});
