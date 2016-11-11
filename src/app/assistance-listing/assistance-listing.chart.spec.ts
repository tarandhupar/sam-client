import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import {PipeTransform, DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';

import { FinancialObligationChart } from './assistance-listing.chart';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';

let comp: FinancialObligationChart;
let fixture: ComponentFixture<FinancialObligationChart>;

export class FilterMultiArrayObjectCustomPipe implements PipeTransform {
  transform(aValue:any[], aData:any[], fieldName:string, isNested:boolean, nestedFieldName:string):any[] {
    // TODO: REMOVE THIS WORKAROUND & FIX MOCK SERVICE DICTIONARY
    return [{
      code: "B",
      elements: null,
      description: null,
      element_id: "0003003",
      value: "Project Grants",
      displayValue: "B - Project Grants"
    }];
    // END TODO
  }
}

describe('FinancialObligationChart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        FilterMultiArrayObjectPipe,
        FinancialObligationChart
      ], //declare main and subcomponents
      providers: [
        {provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectCustomPipe},
      ]
    });

    fixture = TestBed.createComponent(FinancialObligationChart);
    comp = fixture.componentInstance;

    this.mockedFinancialData = [{
      "values": {
        "2013": {"actual": 14853701, "estimate": 20367988},
        "2014": {"estimate": 16305218},
        "2015": {"estimate": 21300000}
      },
      "questions": {"recovery": {"flag": "na"}, "salary_or_expense": {"flag": "na"}},
      "additionalInfo": {},
      "assistanceType": "0003003"
    }];
    this.aDictionaries = {
      "assistance_type": [
        {
          code: "B",
          elements: null,
          description: null,
          element_id: "0003003",
          value: "Project Grants",
          displayValue: "B - Project Grants"
        }
      ]
    };

    fixture.detectChanges(); // 1st change detection triggers ngOnInit
  });

  // TODO - Expand tests
  it('Should prepare data', () => {
    let result = comp.prepareVisualizationData(this.mockedFinancialData, this.aDictionaries);
    expect(result[0].obligation).toBe('Project Grants');
    expect(result[0].amount).toBe(14853701);
    expect(result[0].estimate).toBe(false);
    expect(result[0].ena).toBe(false);
    expect(result[0].nsi).toBe(false);
    expect(result[1]).toBeDefined();
    expect(result[2]).toBeDefined();
  });

  // TODO - Expand tests
  it('Should display chart', () => {
    comp.createVisualization(comp.prepareVisualizationData(this.mockedFinancialData, this.aDictionaries));
    fixture.detectChanges();
    let chart = fixture.nativeElement.querySelector('#chart');
    let table = fixture.nativeElement.querySelector('#chart-table');
    expect(chart).not.toBeNull();
    expect(table).not.toBeNull();
  });
});
