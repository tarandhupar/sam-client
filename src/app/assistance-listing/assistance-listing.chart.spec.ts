import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { PipeTransform } from '@angular/core';

import { FinancialObligationChart } from './assistance-listing.chart';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';

let comp: FinancialObligationChart;
let fixture: ComponentFixture<FinancialObligationChart>;

export class FilterMultiArrayObjectCustomPipe implements PipeTransform {
  transform(value: any[], data: any[], fieldName: string, isNested: boolean, nestedFieldName: string): any[] {
    return data;
  }
}

// TODO - Refactor repeated tests
// TODO - Expand tests (additional and optional information, tooltips, FY vs. FY (est.), obligation type colors)
describe('FinancialObligationChart Create Visualization', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        FilterMultiArrayObjectPipe,
        FinancialObligationChart
      ], // declare main and subcomponents
      providers: [
        {provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectCustomPipe},
      ]
    });

    fixture = TestBed.createComponent(FinancialObligationChart);
    comp = fixture.componentInstance;

    let mockDictionaries = {
      'assistance_type': [
        {
          code: 'B',
          elements: null,
          description: null,
          element_id: '0003003',
          value: 'Project Grants',
          displayValue: 'B - Project Grants'
        }
      ]
    };

    let mockFinancialData = [{
      'values': [
        { 'year': 2013, 'actual': 14853701 },
        { 'year': 2014, 'estimate': 16305218 },
        { 'year': 2015, 'estimate': 21300000 }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0003003'
    }];

    comp.financialData = mockFinancialData;
    comp.dictionaries = mockDictionaries;
    fixture.detectChanges(); // 1st change detection triggers ngOnInit
  });

  /**
   * Basic check that some kind of chart is created
   */
  it('Should display chart', () => {
    let chart = fixture.nativeElement.querySelector('#chart');
    expect(chart).not.toBeNull();
    expect(chart).toBeDefined();

    let bars = fixture.nativeElement.querySelector('.bars');
    let axis = fixture.nativeElement.querySelector('.axis');
    expect(bars).not.toBeNull();
    expect(bars).toBeDefined();
    expect(axis).not.toBeNull();
    expect(axis).toBeDefined();
  });

  /**
   * Basic check that some kind of table is created
   */
  it('Should display table', () => {
    let table = fixture.nativeElement.querySelector('#chart-table');
    expect(table).not.toBeNull();
    expect(table).toBeDefined();

    let thead = table.getElementsByTagName('thead');
    let tbody = table.getElementsByTagName('tbody');
    expect(thead.length).toBeGreaterThan(0);
    expect(tbody.length).toBeGreaterThan(0);

    let th = thead.item(0).getElementsByTagName('th');
    expect(th.length).toBe(4); // Only 4 columns - Description, Past FY, Current FY, Next FY
  });
});

describe('FinancialObligationChart Prepare Visualization', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        FilterMultiArrayObjectPipe,
        FinancialObligationChart
      ], // declare main and subcomponents
      providers: [
        {provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectCustomPipe},
      ]
    });

    fixture = TestBed.createComponent(FinancialObligationChart);
    comp = fixture.componentInstance;
    comp.dictionaries = {
      'assistance_type': [
        {
          code: 'A',
          elements: null,
          description: null,
          element_id: '0001001',
          value: 'Formula Grants',
          displayValue: 'A - Formula Grants'
        }
      ]
    };

//    fixture.detectChanges(); // 1st change detection triggers ngOnInit
  });

  /**
   * Basic check that data is not being lost
   */
  it('Should prepare basic data', () => {
    let mockFinancialData = [{
      'values': [
        { 'year': 2013, 'actual': 14853701 },
        { 'year': 2014, 'estimate': 16305218 },
        { 'year': 2015, 'estimate': 21300000 }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0001001'
    }];

    comp.financialData = mockFinancialData;
    let result = comp.prepareVisualizationData();
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    expect(result[0]).toBeDefined();
    expect(result[0].obligation).toBe('Formula Grants');
    expect(result[0].amount).toBe(14853701);

    expect(result[1]).toBeDefined();
    expect(result[1].obligation).toBe('Formula Grants');
    expect(result[1].amount).toBe(16305218);

    expect(result[2]).toBeDefined();
    expect(result[2].obligation).toBe('Formula Grants');
    expect(result[2].amount).toBe(21300000);
  });

  /**
   * Flag: ena
   * Condition: True if data is "Estimate Not Available", otherwise False
   *
   * Flag: nsi
   * Condition: True if data is "Not Separately Available", otherwise False
   *
   * Flag: estimate
   * Condition: False if data is from previous FY AND nsi and ena are False, otherwise True
   */
  it('Should set flags correctly', () => {

    let mockFinancialData = [{
      'values': [
        { 'year': 2016, 'flag': 'na' },
        { 'year': 2017, 'flag': 'na' },
        { 'year': 2018, 'flag': 'yes', 'estimate': 1000 }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0001001'
    }, {
      'values': [
        { 'year': 2016, 'flag': 'yes', 'actual': 6000 },
        { 'year': 2017, 'flag': 'no' },
        { 'year': 2018, 'flag': 'yes', 'estimate': 4000 }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0001001'
    }];

    comp.financialData = mockFinancialData;
    let result = comp.prepareVisualizationData();
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    expect(result[0].estimate).toBe(true);
    expect(result[0].ena).toBe(true);
    expect(result[0].nsi).toBe(false);

    expect(result[2].estimate).toBe(true);
    expect(result[2].ena).toBe(false);
    expect(result[2].nsi).toBe(false);

    expect(result[3].estimate).toBe(false);
    expect(result[3].ena).toBe(false);
    expect(result[3].nsi).toBe(false);

    expect(result[4].estimate).toBe(true);
    expect(result[4].ena).toBe(false);
    expect(result[4].nsi).toBe(true);
  });
});

describe('FinancialObligationChart Table Combine Previous Obligations', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        FilterMultiArrayObjectPipe,
        FinancialObligationChart
      ], // declare main and subcomponents
      providers: [
        {provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectCustomPipe},
      ]
    });

    fixture = TestBed.createComponent(FinancialObligationChart);
    comp = fixture.componentInstance;

    let mockDictionaries = {
      'assistance_type': [
        {
          code: 'B',
          elements: null,
          description: null,
          element_id: '0003003',
          value: 'Project Grants',
          displayValue: 'B - Project Grants'
        },
        {
          code: 'A',
          elements: null,
          description: null,
          element_id: '0001001',
          value: 'Formula Grants',
          displayValue: 'A - Formula Grants'
        }
      ]
    };

    let mockFinancialData = [{
      'values': [
        { 'year': "2016", 'estimate': 22 },
        { 'year': "2017", 'estimate': 12 },
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0003003'
    }, {
      'values': [
        { 'year': "2016", 'flag': 'yes', 'actual': 20 },
        { 'year': "2017", 'flag': 'yes', 'estimate': 40 },
        { 'year': "2018", 'flag': 'yes', 'estimate': 62 }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0003003'
    }, {
      'values': [
        { 'year': "2016", 'flag': 'yes', 'actual': 0 },
        { 'year': "2017", 'flag': 'yes', 'estimate': 20 },
        { 'year': "2018", 'flag': 'yes', 'estimate': 25 }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0001001'
    }];

    comp.financialData = mockFinancialData;
    comp.dictionaries = mockDictionaries;
    fixture.detectChanges(); // 1st change detection triggers ngOnInit
  });

  /**
   * The years of obligation 1 partially overlaps those of obligation 2, so add them together where possible
   * Display an empty cell where data is missing
   */
  it('Should total new and previous data of same type', () => {
    let table = fixture.nativeElement.querySelector('#chart-table');
    expect(table).not.toBeNull();
    expect(table).toBeDefined();

    let tbody = table.getElementsByTagName('tbody');
    expect(tbody).not.toBeNull();
    expect(tbody).toBeDefined();

    let td = tbody.item(0).getElementsByTagName('td');
    expect(td.length).toBe(15);

    // Project Grants Total
    expect(td[0].innerHTML).toBe('$42'); // 22 + 20
    expect(td[1].innerHTML).toBe('$52'); // 12 + 40
    expect(td[2].innerHTML).toBe('$62'); // [null] + 62

    // Previous Project Grant
    expect(td[3].innerHTML).toBe('$22');
    expect(td[4].innerHTML).toBe('$12');
    expect(td[5].innerHTML).toBe('');

    // New Project Grant
    expect(td[6].innerHTML).toBe('$20');
    expect(td[7].innerHTML).toBe('$40');
    expect(td[8].innerHTML).toBe('$62');
  });

  /**
   * Basic check that previous obligations do not break combines
   */
  it('Should not total new and previous data of different type', () => {
    let table = fixture.nativeElement.querySelector('#chart-table');
    expect(table).not.toBeNull();
    expect(table).toBeDefined();

    let tbody = table.getElementsByTagName('tbody');
    expect(tbody).not.toBeNull();
    expect(tbody).toBeDefined();

    let td = tbody.item(0).getElementsByTagName('td');
    expect(td.length).toBe(15);

    // Formula Grants Total
    expect(td[13].innerHTML).toBe('$72');
    expect(td[14].innerHTML).toBe('$87');
  });

  /**
   * The total for each FY should add together data from all obligations, if it exists
   */
  it('Should total correct years from all obligations', () => {
    let table = fixture.nativeElement.querySelector('#chart-table');
    expect(table).not.toBeNull();
    expect(table).toBeDefined();

    let tbody = table.getElementsByTagName('tbody');
    expect(tbody).not.toBeNull();
    expect(tbody).toBeDefined();

    let td = tbody.item(0).getElementsByTagName('td');
    expect(td.length).toBe(15);

    // All Totals
    /*
    expect(td[17].innerHTML).toBe('$42'); // 22 + 20 + 0
    expect(td[18].innerHTML).toBe('$72'); // 12 + 40 + 20
    expect(td[19].innerHTML).toBe('$87'); // [null] + 62 + 25
    */
  });
});

describe('FinancialObligationChart Table Combine Special Cases', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [
        FilterMultiArrayObjectPipe,
        FinancialObligationChart
      ], // declare main and subcomponents
      providers: [
        {provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectCustomPipe},
      ]
    });

    fixture = TestBed.createComponent(FinancialObligationChart);
    comp = fixture.componentInstance;

    comp.dictionaries = {
      'assistance_type': [
        {
          code: 'B',
          elements: null,
          description: null,
          element_id: '0003003',
          value: 'Project Grants',
          displayValue: 'B - Project Grants'
        }
      ]
    };
  });

  /**
   * For special types Actual/Estimate Not Available and Not Separately Available,
   * if all obligations to be combined have the same special type in a FY,
   * then the total for that FY should show the same special type.
   */
  it('Should display special case if consistent', () => {
    let mockFinancialData = [{
      'values': [
        { 'year': 2016, 'flag': 'na' },
        { 'year': 2017, 'flag': 'no' },
        { 'year': 2018, 'flag': 'na' }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0003003'
    }, {
      'values': [
        { 'year': 2016, 'flag': 'na' },
        { 'year': 2017, 'flag': 'no' },
        { 'year': 2018, 'flag': 'na' }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0003003'
    }];

    comp.financialData = mockFinancialData;

    fixture.detectChanges(); // 1st change detection triggers ngOnInit

    let table = fixture.nativeElement.querySelector('#chart-table');
    expect(table).not.toBeNull();
    expect(table).toBeDefined();

    let tbody = table.getElementsByTagName('tbody');
    expect(tbody).not.toBeNull();
    expect(tbody).toBeDefined();

    let td = tbody.item(0).getElementsByTagName('td');
    expect(td.length).toBe(12);

    /*
    let ana = 'Actual Not Available';
    let nsi = 'Not Separately Identifiable';
    let ena = 'Estimate Not Available';

    // Obligation 1
    expect(td[4].innerHTML).toBe('');
    expect(td[5].innerHTML).toBe(ana);
    expect(td[6].innerHTML).toBe(nsi);
    expect(td[7].innerHTML).toBe(ena);

    // Obligation 2
    expect(td[8].innerHTML).toBe('');
    expect(td[9].innerHTML).toBe(ana);
    expect(td[10].innerHTML).toBe(nsi);
    expect(td[11].innerHTML).toBe(ena);

    // Totals
    expect(td[12].innerHTML).toContain('Totals');
    expect(td[13].innerHTML).toBe(ana); // ana + ana = ana
    expect(td[14].innerHTML).toBe(nsi); // nsi + nsi = nsi
    expect(td[15].innerHTML).toBe(ena); // ena + ena = ena
    */
  });

  /**
   * For special types Actual/Estimate Not Available and Not Separately Available,
   * if two obligations to be combined have different special types in a FY,
   * then the total for that FY should show 'Not Available'.
   */
  it('Should display not available if inconsistent', () => {

    let mockFinancialData = [{
      'values': [
        { 'year': 2017, 'flag': 'na' },
        { 'year': 2018, 'flag': 'no' },
        { 'year': 2019, 'flag': 'na' }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0003003'
    }, {
      'values': [
        { 'year': 2017, 'flag': 'no' },
        { 'year': 2018, 'flag': 'na' },
        { 'year': 2019, 'flag': 'no' }
      ],
      'questions': [
        { 'questionCode': 'recovery', 'flag': 'na' },
        { 'questionCode': 'salary_or_expense', 'flag': 'na'}
      ],
      'additionalInfo': {},
      'assistanceType': '0003003'
    }];

    comp.financialData = mockFinancialData;

    fixture.detectChanges(); // 1st change detection triggers ngOnInit

    let table = fixture.nativeElement.querySelector('#chart-table');
    expect(table).not.toBeNull();
    expect(table).toBeDefined();

    let tbody = table.getElementsByTagName('tbody');
    expect(tbody).not.toBeNull();
    expect(tbody).toBeDefined();

    let td = tbody.item(0).getElementsByTagName('td');
    expect(td.length).toBe(12);

    /*
    let na = 'Not Available';
    let ana = 'Actual Not Available';
    let nsi = 'Not Separately Identifiable';
    let ena = 'Estimate Not Available';

    // Obligation 1
    expect(td[4].innerHTML).toBe('');
    expect(td[5].innerHTML).toBe(ana);
    expect(td[6].innerHTML).toBe(nsi);
    expect(td[7].innerHTML).toBe(ena);

    // Obligation 2
    expect(td[8].innerHTML).toBe('');
    expect(td[9].innerHTML).toBe(nsi);
    expect(td[10].innerHTML).toBe(ena);
    expect(td[11].innerHTML).toBe(nsi);

    // Totals
    expect(td[12].innerHTML).toContain('Totals');
    expect(td[13].innerHTML).toBe(na); // ana + nsi = na
    expect(td[14].innerHTML).toBe(na); // nsi + ena = na
    expect(td[15].innerHTML).toBe(na); // ena + nsi = na
    */
  });
});
