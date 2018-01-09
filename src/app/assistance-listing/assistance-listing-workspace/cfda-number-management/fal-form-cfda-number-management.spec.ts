import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FALFormService } from '../../assistance-listing-operations/fal-form.service';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit/index';
import { Observable } from 'rxjs';
import { ProgramService } from '../../../../api-kit/program/program.service';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FHService } from '../../../../api-kit/fh/fh.service';
import { CFDANumberManagementComponent } from './fal-form-cfda-number-management.component';
import { WrapperService } from '../../../../api-kit';
import { ProgramModule } from '../../assistance-listing.module';
import { CommonModule } from "@angular/common";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertFooterService} from "../../../app-components/alert-footer/alert-footer.service";
import { FALFormOverviewComponent } from "../../assistance-listing-operations/sections/overview/fal-form-overview.component";
import { RouterTestingModule } from "@angular/router/testing";

let MockActivatedRoute = {
  snapshot: {
    params: {
      id: jasmine.createSpy('id')
    },
    url: {
      path: jasmine.createSpy('path')
    },
    _routeConfig: {
      path: jasmine.createSpy('path')
    }
  },
  data: {
    subscribe: jasmine.createSpy('subscribe')
  },
  fragment: {
    subscribe: jasmine.createSpy('subscribe')
  }

};


describe("FAL CFDA Number Management Edit",()=>{
  let comp: CFDANumberManagementComponent;
  let fixture: ComponentFixture<CFDANumberManagementComponent>;
  let MockProgramService = jasmine.createSpyObj('MockFormService', ['getPermissions','getFederalHierarchyConfiguration','saveCFDAConfiguration','isCfdaCodeRestricted']);
  let MockFhService = jasmine.createSpyObj('MockFhService',['getOrganizationById']);
  let MockFormService = jasmine.createSpy('MockFormService');
  MockProgramService.getPermissions.and.returnValue(Observable.of({}));
  MockProgramService.getFederalHierarchyConfiguration.and.returnValue(Observable.of({
    "organizationId":"100500291",
    "programNumberLow":10,
    "programNumberHigh":200,
    "modifiedDate":1514932754557,
    "programNumberAuto":true,
    "_links":{"self":{"href":"https://gsaiae-dev02.reisys.com/fac/v1/programs/federalHierarchyConfigurations/100500291"}}
  }));
  MockProgramService.isCfdaCodeRestricted.and.returnValue(Observable.of({}));
  MockProgramService.saveCFDAConfiguration.and.returnValue(Observable.of({}));
  MockFhService.getOrganizationById.and.returnValue(Observable.of({
  "_embedded": [{"org": {"orgKey": 100004222,"a11TacCode": 75,"agencyName": "Department of Health and Human Services","categoryDesc": "DEPARTMENT","categoryId": "CAT-1","cfdaBur": 0,"cfdaCode": "93","cfdaOmb": 9,"createdBy": "","createdDate": 838684800000,"description": "HEALTH AND HUMAN SERVICES, DEPARTMENT OF","fpdsCode": "7500","fpdsOrgId": "7500","cgac": "075","fullParentPath": "100004222","fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF","isSourceCfda": true,"isSourceCwCfda": true,"isSourceFpds": true,"lastModifiedBy": "","lastModifiedDate": 838684800000,"name": "HEALTH AND HUMAN SERVICES, DEPARTMENT OF","ombAgencyCode": "9","orgCode": "ORG-1067","shortName": "HHS","sourceCfdaPk": "0bebbc3b3261e255dc82002b83094717","sourceParentCfdaPk": "","summary": "The Secretary of HHS advises the President on health, welfare, and income security plans, policies, and programs of the Federal government. The Secretary administers these functions through the Office of the Secretary and the Department's 11 operating divisions, including a budget of $460 billion and a workforce of 65,000 employees.  Supports cross-cutting research on health care systems, health care quality and cost issues, and effectiveness of medical treatments. Provides a system of health surveillance to monitor and prevent the outbreak of diseases.  With the assistance of States and other partners, CDC guards against international disease transmission, maintains national health statistics and provides for immunization services, and supports research into disease and injury prevention. Supports a network of 37 hospitals, 60 health centers, 3 school health centers, 46 health stations and 34 urban Indian health centers to provide services to nearly 1.5 million American Indians and Alaska Natives of 557 federally recognized tribes.  Administers the Medicare and Medicaid programs, that provide health care to America's aged and indigenous populations.  About one in every four Americans, including nearly 18 million children and nursing homes for low-income elderly persons are covered.  CMS also administers the new Children's Health Insurance Program through approved State plans that cover more than 2.2 million children.","tas2Code": "75","tas3Code": "75","type": "DEPARTMENT","level": 1,"code": "7500","orgAddresses": [{"addressKey": 100272393,"city": "Washington","countryCode": "US","createdBy": "bb863595cd3aee02b74b10d5ca46fe94","createdDate": 1208872391000,"isSourceCfda": true,"lastModifiedBy": "036016aa5b797617c6023036f5c2df78","lastModifiedDate": 1444320031000,"state": "DC","streetAddress": "Hubert H. Humphrey Building 200 Independence Avenue, SW ","type": "M","zipcode": "20201"}],"hierarchy": [],"l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF","l1OrgKey": 100004222},"_link": {"self": {"href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100004222125"},"logo": {"href": "http://s3.amazonaws.com/federal-organization-icons/100004222.jpg"}}}]

  }));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        CFDANumberManagementComponent,
      ],
      providers: [
        { provide: FHService, useValue: MockFhService },
        { provide: ActivatedRoute, useValue: MockActivatedRoute},
        { provide: AlertFooterService, useValue: jasmine.createSpyObj('MockAlertFooterService',['registerFooterAlert'])},
      ],
      imports: [
        SamUIKitModule,
        RouterTestingModule,
      ]
    }).overrideComponent(CFDANumberManagementComponent,{
      set:{
        providers:[
          { provide: FALFormService, useValue: MockFormService},
          { provide: ProgramService, useValue: MockProgramService },
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CFDANumberManagementComponent);
    comp = fixture.componentInstance;
    spyOn(comp, 'checkControlsValidity');
    fixture.detectChanges();
  });

  it('should exist', () => {
    expect(comp).toBeDefined();
    expect(comp.cfdaNumberConfigForm.controls['lowNumber']).toBeDefined();
    expect(comp.cfdaNumberConfigForm.controls['highNumber']).toBeDefined();
    expect(comp.cfdaNumberConfigForm.controls['assignment']).toBeDefined();
  });

  it('program number low', () => {
    expect(comp.cfdaNumberConfigForm.controls['lowNumber'].value).toEqual(10);
  });
  it('program number high', () => {
    expect(comp.cfdaNumberConfigForm.controls['highNumber'].value).toEqual(200);
  });

});
