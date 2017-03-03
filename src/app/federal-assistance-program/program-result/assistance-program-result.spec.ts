import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {AssistanceProgramResult} from './assistance-program-result.component';
import moment = require("moment");

var fixture;
var comp;

var hideStatusLable;
describe('AssistanceProgramResultComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AssistanceProgramResult],
    });

    fixture = TestBed.createComponent(AssistanceProgramResult);

    comp = fixture.componentInstance;
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
    expect(comp.data.publishedDate).toEqual(moment(new Date()).format("MMM D, Y H:mm a"));
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
