import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CfdaNumbersPage} from "./cfda-numbers.page";
import {ProgramService} from "../../../../api-kit/program/program.service";
import {IBreadcrumb} from "sam-ui-elements/src/ui-kit/types";
import {SamUIKitModule} from "sam-ui-elements/src/ui-kit/index";
import {SamAPIKitModule} from "../../../../api-kit/api-kit.module";
import {AppComponentsModule} from "../../../app-components/app-components.module";
import {PipesModule} from "../../../app-pipes/app-pipes.module";
import {FormatFederalHierarchyType} from "../../pipes/format-federal-hierarchy-type.pipe";
import {FHService} from "../../../../api-kit/fh/fh.service";
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs';
import * as Cookies from 'js-cookie';

let comp;
let fixture;

var MockProgramService = {
  getPermissions: (cookie: string, permissions: any) => {
    return Observable.of({
      "ORG_LEVELS":
      {
        "org":"100004222",
        "level":"all"
      }
    });
  },
  getFederalHierarchyConfigurations: (orgKeys: string) => {
    return Observable.of({
      "_embedded": {
        "federalHierarchyConfigurationList": [
          {
            "organizationId": "100532605",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505416810244,
            "programNumberAuto": false
          },
          {
            "organizationId": "100500345",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1246995080000,
            "programNumberAuto": true
          },
          {
            "organizationId": "100075508",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505844943886,
            "programNumberAuto": false
          },
          {
            "organizationId": "100035685",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1496776456000,
            "programNumberAuto": false
          },
          {
            "organizationId": "100008531",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1426163736000,
            "programNumberAuto": false
          },
          {
            "organizationId": "100008023",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1330551892000,
            "programNumberAuto": false
          },
          {
            "organizationId": "100004343",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505843186776,
            "programNumberAuto": false
          },
          {
            "organizationId": "100004223",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505416854902,
            "programNumberAuto": false
          },
          {
            "organizationId": "100004222",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1444334431000,
            "programNumberAuto": false
          }
        ]
      },
      "_links": {
        "self": {
          "href": "https://gsaiae-dev02.reisys.com/fac/v1/programs/federalHierarchyConfigurations/?orgKeys=100004222,100004343,100075508,100532605,100500345,100516475,100516474,100004223,100004455,100035685,100038381,100079595,100071017,100008023,100008531,100036688,100532953,100004570,100164040,100533198"
        }
      },
      "page": {
        "size": 20,
        "totalElements": 9,
        "totalPages": 1,
        "number": 0
      }
    });
  }
};

var MockFHService = {
  getOrganizationById: (id: string, includeChildrenLevels: boolean, includeOrgTypes: boolean = false, status: string = 'all', pageSize: number = 10, pageNum: number = 1, orderBy: string = "asc") => {
    return Observable.of({
      "_embedded": [
        {
          "org": {
            "orgKey": 100004222,
            "agencyName": "Department of Health and Human Services",
            "categoryDesc": "DEPARTMENT",
            "categoryId": "CAT-1",
            "cfdaCode": "93",
            "fpdsCode": "7500",
            "fpdsOrgId": "7500",
            "cgac": "075",
            "fullParentPath": "100004222",
            "fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF",
            "name": "HEALTH AND HUMAN SERVICES, DEPARTMENT OF",
            "shortName": "HHS",
            "summary": "The Secretary of HHS advises the President on health, welfare, and income security plans, policies, and programs of the Federal government. The Secretary administers these functions through the Office of the Secretary and the Department's 11 operating divisions, including a budget of $460 billion and a workforce of 65,000 employees.  Supports cross-cutting research on health care systems, health care quality and cost issues, and effectiveness of medical treatments. Provides a system of health surveillance to monitor and prevent the outbreak of diseases.  With the assistance of States and other partners, CDC guards against international disease transmission, maintains national health statistics and provides for immunization services, and supports research into disease and injury prevention. Supports a network of 37 hospitals, 60 health centers, 3 school health centers, 46 health stations and 34 urban Indian health centers to provide services to nearly 1.5 million American Indians and Alaska Natives of 557 federally recognized tribes.  Administers the Medicare and Medicaid programs, that provide health care to America's aged and indigenous populations.  About one in every four Americans, including nearly 18 million children and nursing homes for low-income elderly persons are covered.  CMS also administers the new Children's Health Insurance Program through approved State plans that cover more than 2.2 million children.",
            "type": "DEPARTMENT",
            "level": 1,
            "code": "7500",
            "hierarchy": [
              {
                "org": {
                  "orgKey": 100004343,
                  "categoryDesc": "AGENCY",
                  "categoryId": "CAT-2",
                  "cfdaCode": "",
                  "fpdsCode": "7503",
                  "fpdsOrgId": "7503",
                  "cgac": "075",
                  "fullParentPath": "100004222.100004343",
                  "fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF.OFFICE_OF_THE_GENERAL_COUNSEL",
                  "name": "OFFICE OF THE GENERAL COUNSEL",
                  "parentOrgKey": 100004222,
                  "type": "AGENCY",
                  "level": 2,
                  "code": "7503",
                  "hierarchy": [],
                  "parentOrg": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                  "l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                  "l2Name": "OFFICE OF THE GENERAL COUNSEL",
                  "l1OrgKey": 100004222
                },
                "_link": {
                  "self": {
                    "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100004343"
                  }
                }
              },
              {
                "org": {
                  "orgKey": 100075508,
                  "categoryDesc": "AGENCY",
                  "categoryId": "CAT-2",
                  "cfdaCode": "",
                  "fpdsCode": "7530",
                  "fpdsOrgId": "7530",
                  "cgac": "075",
                  "fullParentPath": "100004222.100075508",
                  "fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF.CENTERS_FOR_MEDICARE_AND_MEDICAID_SERVICES",
                  "name": "CENTERS FOR MEDICARE AND MEDICAID SERVICES",
                  "parentOrgKey": 100004222,
                  "type": "AGENCY",
                  "level": 2,
                  "code": "7530",
                  "hierarchy": [],
                  "parentOrg": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                  "l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                  "l2Name": "CENTERS FOR MEDICARE AND MEDICAID SERVICES",
                  "l1OrgKey": 100004222
                },
                "_link": {
                  "self": {
                    "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100075508"
                  }
                }
              }
            ],
            "l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
            "l1OrgKey": 100004222
          },
          "_link": {
            "self": {
              "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100004222"
            }
          }
        }
      ]
    });
  },
  getOrganizations: () => {
    return Observable.of(
      {
        "_embedded": {    
          "orgs": [      
            {        
              "org": {          
                "orgKey": 100004222,          
                "a11TacCode": 75,          
                "agencyName": "Department of Health and Human Services",          
                "categoryDesc": "DEPARTMENT",          
                "categoryId": "CAT-1",          
                "cfdaBur": 0,          
                "cfdaCode": "93",         
                "cfdaOmb": 9,         
                "createdBy": "",         
                "createdDate": 838684800000,          
                "description": "HEALTH AND HUMAN SERVICES, DEPARTMENT OF",          
                "fpdsCode": "7500",          
                "fpdsOrgId": "7500",          
                "cgac": "075",          
                "fullParentPath": "100004222",          
                "fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF",          
                "isSourceCfda": true,          
                "isSourceCwCfda": true,          
                "isSourceFpds": true,          
                "lastModifiedBy": "",          
                "lastModifiedDate": 838684800000,          
                "name": "HEALTH AND HUMAN SERVICES, DEPARTMENT OF",          
                "ombAgencyCode": "9",          
                "orgCode": "ORG-1067",         
                "shortName": "HHS",          
                "sourceCfdaPk": "0bebbc3b3261e255dc82002b83094717",         
                "sourceParentCfdaPk": "",       
                "summary": "The Secretary of HHS advises the President on health, welfare, and income security plans, policies, and programs of the Federal government. The Secretary administers these functions through the Office of the Secretary and the Department's 11 operating divisions, including a budget of $460 billion and a workforce of 65,000 employees.  Supports cross-cutting research on health care systems, health care quality and cost issues, and effectiveness of medical treatments. Provides a system of health surveillance to monitor and prevent the outbreak of diseases.  With the assistance of States and other partners, CDC guards against international disease transmission, maintains national health statistics and provides for immunization services, and supports research into disease and injury prevention. Supports a network of 37 hospitals, 60 health centers, 3 school health centers, 46 health stations and 34 urban Indian health centers to provide services to nearly 1.5 million American Indians and Alaska Natives of 557 federally recognized tribes.  Administers the Medicare and Medicaid programs, that provide health care to America's aged and indigenous populations.  About one in every four Americans, including nearly 18 million children and nursing homes for low-income elderly persons are covered.  CMS also administers the new Children's Health Insurance Program through approved State plans that cover more than 2.2 million children.",          
                "tas2Code": "75",          
                "tas3Code": "75",          
                "type": "DEPARTMENT",          
                "level": 1,          
                "code": "7500",          
                "orgAddresses": [            
                  {              
                    "addressKey": 100272393,              
                    "city": "Washington",              
                    "countryCode": "US",              
                    "createdBy": "bb863595cd3aee02b74b10d5ca46fe94",              
                    "createdDate": 1208872391000,              
                    "isSourceCfda": true,              
                    "lastModifiedBy": "036016aa5b797617c6023036f5c2df78",              
                    "lastModifiedDate": 1444320031000,              
                    "state": "DC",              
                    "streetAddress": "Hubert H. Humphrey Building 200 Independence Avenue, SW ",              
                    "type": "M",              
                    "zipcode": "20201"            
                  }          
                ],          
                "hierarchy": [],          
                "l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",          
                "l1OrgKey": 100004222        
              },        
              "_link": {          
                "self": {            
                  "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100004222127"          
                },          
                "logo": {            
                  "href": "http://s3.amazonaws.com/federal-organization-icons/100004222.jpg"          
                }        
              }      
            }      
          ]  
        },  
        "_link": {    
          "self": {      
            "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations?orgKey=100004222,100008531"    
          }  
        }  
      })}
};

describe('src/app/assistance-listing/assistance-listing-workspace/cfda-numbers/cfda-numbers.page.ts', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CfdaNumbersPage,
          FormatFederalHierarchyType,
        ],
        imports: [
          SamUIKitModule,
          FormsModule,
          AppComponentsModule,
          PipesModule,
          RouterTestingModule.withRoutes([
            {path: 'cfda-numbers', component: CfdaNumbersPage}
          ]),
        ],
        providers: [
          {provide: ProgramService, useValue: MockProgramService},
          {provide: FHService, useValue: MockFHService}
        ],

      });

      fixture = TestBed.createComponent(CfdaNumbersPage);
      comp = fixture.componentInstance;
      Cookies.set('iPlanetDirectoryPro', 'anything');
      comp.crumbs = [
        { breadcrumb:'Home', url:'/',},
        { breadcrumb: 'Workspace', url: '/workspace' },
        { breadcrumb: 'CFDA Number Management'}
      ];
      fixture.detectChanges();
      
  });

  it('Should init & load org data', () => {
    expect(comp.orgLevels).toBeDefined();
    expect(comp.orgRoot).toBeDefined();
  });
});
