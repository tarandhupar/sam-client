import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {SamUIKitModule} from 'sam-ui-elements/src/ui-kit';
import {AssistanceProgramResult} from './assistance-program-result.component';
import {FALWrapperChangeRequestDropdownComponent} from "../../components/change-request-dropdown/wrapper-change-request-dropdown.component";
import {FALChangeRequestDropdownComponent} from "../../components/change-request-dropdown/change-request-dropdown.component";
import {RequestLabelPipe} from "../../pipes/request-label.pipe";

import moment = require("moment");

var fixture;
var comp;

var hideStatusLable;
describe('AssistanceProgramResultComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,SamUIKitModule],
      declarations: [AssistanceProgramResult,FALChangeRequestDropdownComponent,FALWrapperChangeRequestDropdownComponent,RequestLabelPipe],
    });

    fixture = TestBed.createComponent(AssistanceProgramResult);
    comp = fixture.componentInstance;
    hideStatusLable = fixture.nativeElement.querySelectorAll('.toggleStatusCode'); // find element
    comp.data =
      {
        "data": {
          "title": "Yukon River Salmon Research and Management Assistance",
          "programNumber": "15.671",
          "organizationId": '1'
        },
        "status": {
          "code": "published",
          "value": "Published"
        }
      }
    fixture.detectChanges();
  });

  it('should have defined component', () => {
    expect(comp).toBeDefined();
  });

  it('should have status undefined', () => {
    comp.data =
      {
        "data": {
          "title": "Yukon River Salmon Research and Management Assistance",
          "programNumber": "15.671",
          "organizationId": '1'
        },
        "status": {}
      }
    fixture.detectChanges();
    comp.toggleBgColor();
    expect(comp.data.status).toEqual(({}));
  });

  it('should have showHideStatusText component', () => {
    comp.showhideStatus = 'pubished';
    fixture.detectChanges();
    expect(comp.showHideStatusText).toEqual('none');

  });

  it('should have published Date component', () => {
    expect(comp.data.publishedDate).toEqual(moment(new Date()).format("MMM D, Y h:mm a"));
  });

  it('should have color component', () => {
    comp.data =
      {
        "data": {
          "title": "Yukon River Salmon Research and Management Assistance",
          "programNumber": "15.671",
          "organizationId": '1'
        },
        "status": {
          "code": "draft",
          "value": "Published"
        }
      }
    fixture.detectChanges();
    comp.toggleBgColor();
    expect(comp.randomColor).toEqual('#2e8540');
  });
});
