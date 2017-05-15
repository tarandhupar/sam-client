import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PipeTransform } from '@angular/core';
import { DateFormatPipe } from '../app-pipes/date-format.pipe';
import { ActivatedRoute } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { WageDeterminationService } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-kit';

import { WageDeterminationPage } from './wage-determination.page';
import { Observable } from 'rxjs';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';

let comp:    WageDeterminationPage;
let fixture: ComponentFixture<WageDeterminationPage>;

let MockWageDeterminationService = {
  getWageDeterminationDictionary(ids:String) {
    return Observable.of({
      _embedded: {
        dictionaries: [
          {
            elements: [
              {
                elementId: "KS",
                value: "Kansas",
                description: null,
                elements: null
              },
              {
                elementId: "WI",
                value: "Wisconsin",
                description: null,
                elements: null
              },
              {
                elementId: "IL",
                value: "Illinois",
                description: null,
                elements: null
              }
            ],
            id: "wdStates"
          },
          {
            elements: [
              {
                elementId: "16670",
                value: "Pike",
                description: null,
                elements: null
              },
              {
                elementId: "16062",
                value: "Santa Fe",
                description: null,
                elements: null
              },
              {
                elementId: "14834",
                value: "Refugio",
                description: null,
                elements: null
              }
            ],
            id: "wdCounties"
          },
          {
            elements: [

              {
                elementId: "19",
                value: "River Transportation",
                description: "This WD may be used only on Corps of Engineers contracts for transportation of personnel on inland river ways.",
                elements: null
              },
              {
                elementId: "14",
                value: "Health Physics Technician Services",
                description: "This WD may be used for contracts for Department of Energy only.",
                elements: null
              }
            ],
            id: "scaServices"
          }
        ]
      }
    });
},
  getWageDeterminationHistoryByReferenceNumber(id: String){
    return Observable.of({
      "_embedded": {
        "wageDetermination": [
          {
            "fullReferenceNumber": "ak20170001",
            "revisionNumber": 0,
            "shortName": "ak1",
            "year": 2017,
            "publishDate": "2017-01-19 19:00:00",
            "active": false,
            "standard": false
          },
          {
            "fullReferenceNumber": "ak20170001",
            "revisionNumber": 1,
            "shortName": "ak1",
            "year": 2017,
            "publishDate": "2017-01-26 19:00:00",
            "active": false,
            "standard": false
          },
          {
            "fullReferenceNumber": "ak20170001",
            "revisionNumber": 2,
            "shortName": "ak1",
            "year": 2017,
            "publishDate": "2017-02-16 19:00:00",
            "active": false,
            "standard": false
          },
          {
            "fullReferenceNumber": "ak20170001",
            "revisionNumber": 3,
            "shortName": "ak1",
            "year": 2017,
            "publishDate": "2017-03-16 19:00:00",
            "active": false,
            "standard": false
          },
          {
            "fullReferenceNumber": "AK20170001",
            "revisionNumber": 4,
            "shortName": "AK1",
            "year": 2017,
            "publishDate": "2017-03-16 19:00:00",
            "active": true,
            "standard": false
          },
          {
            "fullReferenceNumber": "AK20170001",
            "revisionNumber": 5,
            "shortName": "AK1",
            "year": 2017,
            "publishDate": "2017-03-16 19:00:00",
            "active": true,
            "standard": true
          }
        ]
      }
    });
  },
  getWageDeterminationByReferenceNumberAndRevisionNumber: (referenceNumber: string, revisionNumber: number) => {
    return Observable.of({
      "fullReferenceNumber": "1998-0642",
      "revisionNumber": 3,
      "location": [{
        "state": "KS",
        "statewideFlag": false,
        "counties": [16670, 16062]
      }
      ],
      "services": [
        19
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

describe('src/app/wage-determination/wage-determination.spec.ts', () => {
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
        { provide: ActivatedRoute, useValue: { 'params': Observable.of({'referencenumber': '2002-0261', 'revisionnumber': '8'}), 'queryParams': Observable.from([{}]) } },
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

  it('WageDeterminationPage: Should init & load data', () => {
    expect(comp.wageDetermination).toBeDefined();
    expect(comp.isSCA).toBeDefined();
    expect(comp.referenceNumber).toBeDefined();
    expect(comp.revisionNumber).toBeDefined();
    expect(comp.currentUrl).toBeDefined();
    expect(comp.dictionaries).toBeDefined();
    expect(comp.locations).toBeDefined();
    expect(comp.services).toBeDefined();
    expect(comp.history).toBeDefined();
    expect(comp.processedHistory).toBeDefined();
    expect(comp.longProcessedHistory).toBeDefined();
    expect(comp.shortProcessedHistory).toBeDefined();
    expect(comp.showRevisonMessage).toBeDefined();
    expect(comp.showRevisonMessage).toBe(true);
  });
});
