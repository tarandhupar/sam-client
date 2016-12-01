import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamUIKitModule} from 'ui-kit';
import {RouterTestingModule} from "@angular/router/testing";
import {AlertItemComponent} from "./alert-item.component";
import {Alert} from "../alert.model";
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";

// Load test data
import {error, info, warning} from '../alerts-test-data.spec';


describe('The AlertItem component', () => {
  let component:AlertItemComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertItemComponent, DateFormatPipe],
      imports: [SamUIKitModule,RouterTestingModule],
    });

    fixture = TestBed.createComponent(AlertItemComponent);
    component = fixture.componentInstance;
  });

  it('should compile with an error alert', () => {
    component.alert = Alert.FromResponse(error);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[class*=error]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[class*=warning]')).toBeFalsy();
  });

  it('should compile with an warning alert', () => {
    component.alert = Alert.FromResponse(warning);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[class*=warning]')).toBeTruthy();
  });

  it('should compile with an info alert', () => {
    component.alert = Alert.FromResponse(info);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[class*=info]')).toBeTruthy();
  });

});
