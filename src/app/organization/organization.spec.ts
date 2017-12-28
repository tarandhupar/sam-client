import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By }              from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FHService } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';

import { OrganizationPage } from './organization.page';
import { Observable } from 'rxjs';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { AppComponentsModule } from 'app/app-components/app-components.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let comp:    OrganizationPage;
let fixture: ComponentFixture<OrganizationPage>;

let MockFHService = {
  getOrganizationById: (id: string, includeChildrenLevels: boolean, includeOrgTypes: boolean = false, status: string = 'all', pageSize: number = 10, pageNum: number = 1, orderBy: string = "asc", hasFPDS: boolean = false) => {
    return Observable.of({
      _embedded: [
        {
          org: {
            orgKey: 100035122,
            a11TacCode: 13,
            agencyName: "Department of Commerce",
            categoryDesc: "DEPARTMENT",
            categoryId: "CAT-1",
            cfdaBur: 0,
            cfdaCode: "11",
            cfdaOmb: 6,
            createdBy: "",
            createdDate: 838684800000,
            description: "COMMERCE, DEPARTMENT OF",
            fpdsCode: "1300",
            fpdsOrgId: "1300",
            cgac: "013",
            fullParentPath: "100035122",
            fullParentPathName: "COMMERCE_DEPARTMENT_OF",
            isSourceCfda: true,
            isSourceCwCfda: true,
            isSourceFpds: true,
            lastModifiedBy: "",
            lastModifiedDate: 1440633600000,
            name: "COMMERCE, DEPARTMENT OF",
            ombAgencyCode: "6",
            orgCode: "ORG-1072",
            shortName: "",
            sourceCfdaPk: "eb778728054c2bb65dab9a6138e024c9",
            sourceParentCfdaPk: "",
            tas2Code: "13",
            tas3Code: "13",
            type: "DEPARTMENT",
            level: 1,
            code: "1300",
            orgAddresses: [
              {
                addressKey: 100272456,
                city: "",
                countryCode: "US",
                createdBy: "bb863595cd3aee02b74b10d5ca46fe94",
                createdDate: 1208872179000,
                isSourceCfda: true,
                lastModifiedBy: "036016aa5b797617c6023036f5c2df78",
                lastModifiedDate: 1444320264000,
                state: "",
                streetAddress: "",
                zipcode: ""
              }
            ],
            hierarchy: [
              {
                org: {
                  orgKey: 100109750,
                  a11TacCode: 7,
                  agencyName: "U. S. Census Bureau",
                  categoryDesc: "AGENCY",
                  categoryId: "CAT-2",
                  cfdaCode: "",
                  createdBy: "MIGRATOR",
                  createdDate: 1079740800000,
                  description: "US CENSUS BUREAU",
                  fpdsCode: "1323",
                  fpdsOrgId: "1323",
                  cgac: "013",
                  fullParentPath: "100035122.100109750",
                  fullParentPathName: "COMMERCE_DEPARTMENT_OF.US_CENSUS_BUREAU",
                  isSourceCfda: true,
                  isSourceCwCfda: true,
                  isSourceFpds: true,
                  lastModifiedBy: "DODMIGRATOR",
                  lastModifiedDate: 1143676800000,
                  name: "US CENSUS BUREAU",
                  orgCode: "ORG-2209",
                  parentOrgKey: 100035122,
                  shortName: "",
                  sourceCfdaPk: "1119bcbd75c46556b42d7ad9de061d1d",
                  sourceParentCfdaPk: "eb778728054c2bb65dab9a6138e024c9",
                  type: "AGENCY",
                  level: 2,
                  code: "1323",
                  orgAddresses: [ ],
                  hierarchy: [ ],
                  l1OrgKey: 100035122,
                  parentOrg: "COMMERCE DEPARTMENT OF",
                  l1Name: "COMMERCE DEPARTMENT OF",
                  l2Name: "US CENSUS BUREAU"
                },
                _link: {
                  rel: "self",
                  href: "http://csp-api.sam.gov/comp/fh/v1/organization/100109750"
                }
              },
              {
                org: {
                  orgKey: 100183429,
                  a11TacCode: 25,
                  agencyName: "International Trade Administration",
                  categoryDesc: "AGENCY",
                  categoryId: "CAT-2",
                  cfdaBur: 25,
                  cfdaCode: "11",
                  cfdaOmb: 6,
                  createdBy: "",
                  createdDate: 1459468800000,
                  description: "INTERNATIONAL TRADE ADMINISTRATION",
                  fpdsCode: "1350",
                  fpdsOrgId: "1350",
                  cgac: "013",
                  fullParentPath: "100035122.100183429",
                  fullParentPathName: "COMMERCE_DEPARTMENT_OF.INTERNATIONAL_TRADE_ADMINISTRATION",
                  isSourceCfda: true,
                  isSourceCwCfda: true,
                  isSourceFpds: true,
                  lastModifiedBy: "",
                  lastModifiedDate: 1459468800000,
                  name: "INTERNATIONAL TRADE ADMINISTRATION",
                  orgCode: "ORG-2215",
                  parentOrgKey: 100035122,
                  shortName: "",
                  sourceCfdaPk: "218a1050e64de3221d0686f3b3e1b704",
                  sourceParentCfdaPk: "eb778728054c2bb65dab9a6138e024c9",
                  summary: "Promotes world trade and strengthens the international trade and investment position of the United States. ",
                  type: "AGENCY",
                  level: 2,
                  code: "1350",
                  orgAddresses: [ ],
                  hierarchy: [ ],
                  l1OrgKey: 100035122,
                  parentOrg: "COMMERCE DEPARTMENT OF",
                  l1Name: "COMMERCE DEPARTMENT OF",
                  l2Name: "INTERNATIONAL TRADE ADMINISTRATION"
                },
                _link: {
                  rel: "self",
                  href: "http://csp-api.sam.gov/comp/fh/v1/organization/100183429"
                }
              }
            ],
            l1OrgKey: 100035122,
            l1Name: "COMMERCE DEPARTMENT OF"
          },
          count:1,
          _link: {
            rel: "self",
            href: "http://csp-api.sam.gov/comp/fh/v1/organization/100035122"
          }
        }
      ]
    });
  },
  getOrganizationLogo(organizationAPI: Observable<any>, cbSuccessFn: any, cbErrorFn: any) {
    return Observable.of("");
  }
};


describe('src/app/organization/organization.spec.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationPage ], // declare the test component
      imports: [
        RouterTestingModule,
        SamUIKitModule,
        AppComponentsModule,
        PipesModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { 'params': Observable.of([{ 'id': '100035122' }]), 'queryParams': Observable.of([{}]) } },
        { provide: FHService, useValue: MockFHService }
      ]
    });

    fixture = TestBed.createComponent(OrganizationPage);
    comp = fixture.componentInstance; // BannerComponent test instance
    fixture.detectChanges();
  });

  it('OrganizationPage: Should init & load data', () => {
    // expect(comp.organization).toBeDefined();
    // expect(comp.organizationPerPage).toBeDefined();
    // expect(comp.subscription).toBeDefined();
    // expect(comp.min).toBeDefined();
    // expect(comp.max).toBeDefined();
    expect(comp.organization.description).toBe("COMMERCE, DEPARTMENT OF");
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerHTML).toContain('COMMERCE, DEPARTMENT OF');
  });
});
