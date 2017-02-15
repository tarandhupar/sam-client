import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PipeTransform } from '@angular/core';
import { By }              from '@angular/platform-browser';
import { DateFormatPipe } from '../app-pipes/date-format.pipe';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { WageDeterminationService } from 'api-kit';
import { SamUIKitModule } from 'ui-kit';

import { WageDeterminationPage } from './wage-determination.page';
import { Observable } from 'rxjs';
//import { PipesModule } from '../app-pipes/app-pipes.module';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';

let comp:    WageDeterminationPage;
let fixture: ComponentFixture<WageDeterminationPage>;

let MockWageDeterminationService = {
  getWageDeterminationDictionary(ids: String) {
    return Observable.of({
      classification_code: [
        {
          dictionary_name: "classification_code",
          code: "10",
          parent_element_id: null,
          description: null,
          element_id: "1",
          sort_index: "1",
          value: "10 -- Weapons"
        }
      ]
    });
  },
  getWageDeterminationByReferenceNumberAndRevisionNumber: (referenceNumber: string, revisionNumber: number) => {
    return Observable.of({
      "fullReferenceNumber": "1998-0642",
      "revisionNumber": 31,
      "location": [
        {
          "state": "AK",
          "counties": [
            null
          ]
        },
        {
          "state": "AL",
          "counties": [
            null
          ]
        },
        {
          "state": "AZ",
          "counties": [
            null
          ]
        },
        {
          "state": "CA",
          "counties": [
            null
          ]
        },
        {
          "state": "CO",
          "counties": [
            null
          ]
        },
        {
          "state": "CT",
          "counties": [
            null
          ]
        },
        {
          "state": "DC",
          "counties": [
            null
          ]
        },
        {
          "state": "FL",
          "counties": [
            null
          ]
        },
        {
          "state": "GA",
          "counties": [
            null
          ]
        },
        {
          "state": "IA",
          "counties": [
            null
          ]
        },
        {
          "state": "ID",
          "counties": [
            null
          ]
        },
        {
          "state": "IL",
          "counties": [
            null
          ]
        },
        {
          "state": "IN",
          "counties": [
            null
          ]
        },
        {
          "state": "KS",
          "counties": [
            null
          ]
        },
        {
          "state": "LA",
          "counties": [
            null
          ]
        },
        {
          "state": "MA",
          "counties": [
            null
          ]
        },
        {
          "state": "MD",
          "counties": [
            null
          ]
        },
        {
          "state": "ME",
          "counties": [
            null
          ]
        },
        {
          "state": "MI",
          "counties": [
            null
          ]
        },
        {
          "state": "MN",
          "counties": [
            null
          ]
        },
        {
          "state": "MO",
          "counties": [
            null
          ]
        },
        {
          "state": "MS",
          "counties": [
            null
          ]
        },
        {
          "state": "MT",
          "counties": [
            null
          ]
        },
        {
          "state": "NC",
          "counties": [
            null
          ]
        },
        {
          "state": "NE",
          "counties": [
            null
          ]
        },
        {
          "state": "NH",
          "counties": [
            null
          ]
        },
        {
          "state": "NJ",
          "counties": [
            null
          ]
        },
        {
          "state": "NM",
          "counties": [
            null
          ]
        },
        {
          "state": "NV",
          "counties": [
            null
          ]
        },
        {
          "state": "NY",
          "counties": [
            null
          ]
        },
        {
          "state": "OH",
          "counties": [
            null
          ]
        },
        {
          "state": "OK",
          "counties": [
            null
          ]
        },
        {
          "state": "OR",
          "counties": [
            null
          ]
        },
        {
          "state": "PA",
          "counties": [
            null
          ]
        },
        {
          "state": "RI",
          "counties": [
            null
          ]
        },
        {
          "state": "SC",
          "counties": [
            null
          ]
        },
        {
          "state": "SD",
          "counties": [
            null
          ]
        },
        {
          "state": "TN",
          "counties": [
            null
          ]
        },
        {
          "state": "TX",
          "counties": [
            null
          ]
        },
        {
          "state": "UT",
          "counties": [
            null
          ]
        },
        {
          "state": "VA",
          "counties": [
            null
          ]
        },
        {
          "state": "WA",
          "counties": [
            null
          ]
        },
        {
          "state": "WI",
          "counties": [
            null
          ]
        },
        {
          "state": "WV",
          "counties": [
            null
          ]
        }
      ],
      "services": [
        7
      ],
      "document": "WD 98-0642 (Rev.-30) was first posted on www.wdol.gov on 01/05/2016\r\nDebt Collection Services\r\n**********************************************************************************\r\nREGISTER OF WAGE DETERMINATIONS UNDER  |      U.S. DEPARTMENT OF LABOR\r\n        THE SERVICE CONTRACT ACT       | EMPLOYMENT STANDARDS ADMINISTRATION\r\nBy direction of the Secretary of Labor |       WAGE AND HOUR DIVISION\r\n                                       |       WASHINGTON, D.C. 20210\r\n                                       | \r\n                                       | \r\nDaniel W. Simms      Division of Wage  | Wage Determination No: 1998-0642\r\nDirector             Determinations    |           Revision No: 30\r\n                                       |      Date Of Revision: 12/29/2015\r\n----------------------------------------------------------------------------------\r\nNote: Under Executive Order (EO) 13658, an hourly minimum wage of $10.15 for\r\ncalendar year 2016 applies to all contracts subject to the Service Contract Act\r\nfor which the solicitation was issued on or after January 1, 2015. If this\r\ncontract is covered by the EO, the contractor must pay all workers in any\r\nclassification listed on this wage determination at least $10.15 per hour (or\r\nthe applicable wage rate listed on this wage determination, if it is higher) for\r\nall hours spent performing on the contract in calendar year 2016. The EO minimum\r\nwage rate will be adjusted annually. Additional information on contractor\r\nrequirements and worker protections under the EO is available at\r\nwww.dol.gov/whd/govcontracts.\r\nStates: Alabama, Alaska, Arizona, California, Colorado, Connecticut, District of\r\nColumbia, Florida, Georgia, Idaho, Illinois, Indiana, Iowa, Kansas, Louisiana,\r\nMaine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri,\r\nMontana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York,\r\nNorth Carolina, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South\r\nCarolina, South Dakota, Tennessee, Texas, Utah, Virginia, Washington, West\r\nVirginia, Wisconsin\r\nArea: Alaska Statewide\r\nAlabama Statewide\r\nArizona Statewide\r\nCalifornia - All Counties except : San Joaquin\r\nColorado Statewide\r\nConnecticut Statewide\r\nDistrict of Columbia Statewide\r\nFlorida Statewide\r\nGeorgia Statewide\r\nIowa - All Counties except : Page\r\nIdaho Statewide\r\nIllinois - All Counties except : Peoria\r\nIndiana Statewide\r\nKansas Statewide\r\nLouisiana Statewide\r\nMassachusetts Statewide\r\nMaryland Statewide\r\nMaine Statewide\r\nMichigan Statewide\r\nMinnesota - All Counties except : Jackson\r\nMissouri Statewide\r\nMississippi Statewide\r\nMontana Statewide\r\nNorth Carolina Statewide\r\nNebraska Statewide\r\nNew Hampshire Statewide\r\nNew Jersey Statewide\r\nNew Mexico Statewide\r\nNevada Statewide\r\nNew York - All Counties except : Monroe, New York\r\nOhio - All Counties except : Mahoning\r\nOklahoma Statewide\r\nOregon Statewide\r\nPennsylvania - All Counties except : Dauphin, Montgomery\r\nRhode Island Statewide\r\nSouth Carolina Statewide\r\nSouth Dakota Statewide\r\nTennessee - All Counties except : Sumner, Williamson\r\nTexas - All Counties except : Collin, Coryell, Lampasas, Oldham\r\nUtah Statewide\r\nVirginia Statewide\r\nWashington Statewide\r\nWisconsin Statewide\r\nWest Virginia Statewide\r\n----------------------------------------------------------------------------------\r\n\r\n**Fringe Benefits Required Follow the Occupational Listing**\r\n\r\nEmployed on contracts for debt collection services:\r\n\r\nOCCUPATION CODE - TITLE                                  FOOTNOTE             RATE\r\n\r\n01030 - Collection Specialist                                                     \r\n  Alabama Statewide                                                          13.21\r\n  Alaska                                                                     17.68\r\n  Arizona                                                                    13.64\r\n  California Counties of Lathrop, San Joaquin                                16.01\r\n  California-All Counties except: Lathrop, San Joaquin                       16.83\r\n  Colorado Statewide                                                         15.96\r\n  Connecticut Statewide                                                      17.88\r\n  District of Columbia Statewide                                             17.12\r\n  Florida Statewide                                                          15.00\r\n  Georgia Statewide                                                          14.56\r\n  Idaho Statewide                                                            13.89\r\n  Illinois All Counties except: Peoria                                       15.67\r\n  Illinois County of Peoria                                                  14.13\r\n  Indiana Statewide                                                          14.79\r\n  Iowa All Counties except:Page                                              13.99\r\n  Iowa County of Page                                                        13.47\r\n  Kansas Statewide                                                           12.84\r\n  Louisian Statewide                                                         12.92\r\n  Maine Statewide                                                            14.51\r\n  Maryland Statewide                                                         14.70\r\n  Massachusetts Statewide                                                    17.19\r\n  Michigan Statewide                                                         16.65\r\n  Minnesota All Counties except: Jackson                                     17.12\r\n  Minnesota County of Jackson                                                12.25\r\n  Mississippi Statewide                                                      12.19\r\n  Missouri Statewide                                                         13.95\r\n  Montana                                                                    12.94\r\n  Nebraska Statewide                                                         13.47\r\n  Nevada Statewide                                                           14.19\r\n  New Hampshire Statewide                                                    15.46\r\n  New Jersey Statewide                                                       16.53\r\n  New Mexico Statewide                                                       13.38\r\n  New York All Counties except:Monroe, New York                              13.72\r\n  New York County of Monroe                                                  15.13\r\n  New York County of New York                                                18.56\r\n  North Carolina Statewide                                                   14.51\r\n  Ohio All Counties except: Mahoning                                         13.60\r\n  Ohio County of Mahoning                                                    14.92\r\n  Oklahoma Statewide                                                         13.43\r\n  Oregon Statewide                                                           14.92\r\n  Pennsylvania All Counties except:Dauphin, Montgomery, Ft. Washington       14.01\r\n  Pennsylvania Counties of Ft. Washington, Montgomery                        14.24\r\n  Pennsylvania County of Dauphin                                             14.71\r\n  Rhode Island Statewide                                                     15.35\r\n  South Carolina Statewide                                                   13.79\r\n  South Dakota Statewide                                                     12.58\r\n  Tennessee All Counties except: Sumner, Williamson                          14.17\r\n  Tennessee Counties of Sumner, Williamson                                   14.68\r\n  Texas County of Coryell                                                    12.87\r\n  Texas All Counties except:Collin, Corryell, Lampasas,Oldham                15.34\r\n  Texas County of Collin                                                     17.03\r\n  Texas County of Llampasas                                                  13.67\r\n  Texas County of Oldham                                                     11.57\r\n  Utah Statewide                                                             14.13\r\n  Virginia Statewide                                                         14.43\r\n  Washington Statewide                                                       16.11\r\n  West Virginia Statewide                                                    12.36\r\n  Wisconsin Statewide                                                        14.60\r\n__________________________________________________________________________________\r\nALL OCCUPATIONS LISTED ABOVE RECEIVE THE FOLLOWING BENEFITS:\r\n\r\nHEALTH & WELFARE: $4.27 per hour or $170.80 per week or $740.13 per month\r\n\r\nVACATION: 2 weeks paid vacation after 1 year of service with a contractor or\r\nsuccessor, 3 weeks after 5 years, and 4 weeks after 15 years. Length of service\r\nincludes the whole span of continuous service with the present contractor or\r\nsuccessor, wherever employed, and with the predecessor contractors in the\r\nperformance of similar work at the same Federal facility. (Reg. 29 CFR 4.173)\r\n\r\nHOLIDAYS: A minimum of ten paid holidays per year: New Year's Day, Martin Luther\r\nKing Jr.'s Birthday, Washington's Birthday, Memorial Day, Independence Day,\r\nLabor Day, Columbus Day, Veterans' Day, Thanksgiving Day, and Christmas Day. (A\r\ncontractor may substitute for any of the named holidays another day off with pay\r\nin accordance with a plan communicated to the employees involved.) (See 29 CFR\r\n4.174)\r\n\r\n\r\n\r\n\r\n",
      "publishDate": "2016-12-30 00:00:00",
      "standard": false,
      "active": true,
      "_links": {
        "self": {
          "href": "http://localhost:8086/wdol/v1/wd/1998-0642/31"
        }
      }
    });
  }
};

export class FilterMultiArrayObjectCustomPipe implements PipeTransform {
  transform(value: any[], data: any[], fieldName: string, isNested: boolean, nestedFieldName: string): any[] {
    // TODO: REMOVE THIS WORKAROUND & FIX MOCK SERVICE DICTIONARY
    return [{
      code: 'B',
      elements: null,
      description: null,
      element_id: '0003001',
      value: 'Cooperative Agreements',
      displayValue: 'B - Cooperative Agreements'
    }];
    // END TODO
  }
}

describe('WageDeterminationPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WageDeterminationPage,
        FilterMultiArrayObjectPipe,
        DateFormatPipe
      ], // declare the test component
      imports: [
        HttpModule,
        RouterTestingModule,
        SamUIKitModule
      ],
      providers: [
        BaseRequestOptions,
        MockBackend,
        DateFormatPipe,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'referenceNumber': '2002-0261' }, {'revisionNumber': '8'}]), 'queryParams': Observable.from([{}]) } },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: WageDeterminationService, useValue: MockWageDeterminationService },
        { provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectCustomPipe }

      ]
    });

    TestBed.overrideComponent(WageDeterminationPage, {
      set: {
        providers: [
          { provide: WageDeterminationService, useValue: MockWageDeterminationService }
        ]
      }
    });

    fixture = TestBed.createComponent(WageDeterminationPage);
    comp = fixture.componentInstance; // BannerComponent test instance
    fixture.detectChanges();
  });

  it('Should init & load data', () => {
    expect(comp.wageDetermination).toBeDefined();
  });
});
