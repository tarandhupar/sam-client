///<reference path="../../../../node_modules/@types/protractor/index.d.ts"/>
import { WageDeterminationService } from "api-kit";
import { Observable } from "rxjs/Observable";
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SamUIKitModule } from "../../../sam-ui-elements/src/ui-kit/index";
import { RouterTestingModule } from "@angular/router/testing";
import { UserService } from "../../role-management/user.service";
import { CbaPage } from "./wd-cba.page";
import { By } from '@angular/platform-browser';

describe('src/app/wage-determination/cba/wd-cba.page.ts', () => {
  let comp: CbaPage;
  let fixture: ComponentFixture<CbaPage>;

  let wageDeterminationServiceStub = {
    getCBAByReferenceNumber: (cbaNo : string) => {
      return Observable.of({
        data: {
          "cbawdId":7,
          "cbaNumber":"CBA-2003-7",
          "revisionNumber":0,
          "contractServices":"Landscaping services",
          "contractorName":"Hussey Services",
          "contractorUnion":"IAM",
          "localUnionNumber":"123",
          "solicitationContractNo":"F33123",
          "organizationName":"Navy",
          "status":"published",
          "latest":true,
          "createdBy":"138.162.0.41",
          "modifiedBy":"138.162.0.41",
          "effectiveStartDate":"2003-10-01T04:00:00Z",
          "effectiveEndDate":"2006-10-01T04:00:00Z",
          "amendmentDate":"1900-01-01T05:00:00Z",
          "publishedDate":"2003-10-06T04:00:00Z",
          "createdOn":"2003-10-06T04:00:00Z",
          "modifiedOn":"2003-10-06T16:38:27Z",
          "cbaLocation":[{"id":7,"state":"Alabama","county":"Autauga"}]
        }
      });
    }
  };

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

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

//let MockUserService = jasmine.createSpyObj('MockUserService', ['getUser']);

  let MockUserService = {
    getUser: () => {
      return {
        isGov: true,
        lastName: "Administrator",
        _id: "FBO_AA@gsa.gov",
        email: "FBO_AA@gsa.gov",
        _links: {
          self: {
            href: "/comp/iam/auth/v4/session/"
          }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ CbaPage ],
      providers: [
        { provide: UserService, useValue: MockUserService },
        { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'referencenumber': '123' }]) } },
        { provide: WageDeterminationService, useValue: wageDeterminationServiceStub },
        { provide: Router, useValue: router }
      ],
      imports: [
        SamUIKitModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbaPage);
    comp = fixture.componentInstance;
  });

  it('should exist and variables are defined', () => {
    comp.ngOnInit();
    fixture.detectChanges();
    expect(comp).toBeDefined();
    expect(comp['user']).toBeDefined();
    expect(comp['data']).toBeDefined();
    expect(comp['isGovUser']).toEqual(true);
  });

  it('navHandler navigates to correct fragment', () => {
    comp.navHandler('overview');
    expect(router.navigate).toHaveBeenCalledWith(['wage-determination/cba/123/view'], Object({ fragment: 'overview' }) );
    comp.navHandler('agreement');
    expect(router.navigate).toHaveBeenCalledWith(['wage-determination/cba/123/view'], Object({ fragment: 'agreement' }) );
  });

  it('CbaPage: should display hide tabs based on logged in user', () => {
    fixture.detectChanges();
    comp['isGovUser'] = false;
    fixture.detectChanges();
    var tabsElement = fixture.debugElement.query(By.css('#tabs'));
    expect(tabsElement).toBeNull();

    comp['isGovUser'] = true;
    fixture.detectChanges();
    var tabsElement = fixture.debugElement.query(By.css('#tabs'));
    expect(tabsElement).not.toBeNull();
  });

  it('CbaPage: should display all general section values', () => {
    fixture.detectChanges();
    var titleEl = fixture.debugElement.query(By.css('#overview'));
    comp['data'] = {
        "cbawdId":7,
        "cbaNumber":"CBA-2003-7",
        "revisionNumber":0,
        "contractServices":"Landscaping services",
        "contractorName":"Hussey Services",
        "contractorUnion":"IAM",
        "localUnionNumber":"123",
        "solicitationContractNo":"F33123",
        "organizationName":"Navy",
        "status":"published",
        "latest":true,
        "createdBy":"138.162.0.41",
        "modifiedBy":"138.162.0.41",
        "effectiveStartDate":"2003-10-01T04:00:00Z",
        "effectiveEndDate":"2006-10-01T04:00:00Z",
        "amendmentDate":"1900-01-01T05:00:00Z",
        "publishedDate":"2003-10-06T04:00:00Z",
        "createdOn":"2003-10-06T04:00:00Z",
        "modifiedOn":"2003-10-06T16:38:27Z",
        "cbaLocation":[{"id":7,"state":"Alabama","county":"Autauga"}]
    };
    fixture.detectChanges();
    expect(titleEl.nativeElement.textContent).toContain("Collective Bargaining Agreement # CBA-2003-7");

    var revisionNoElement = fixture.debugElement.query(By.css('#cba-revision-number'));
    expect(revisionNoElement.nativeElement.textContent).toContain(0);

    var dateElement = fixture.debugElement.query(By.css('#cba-date .description'));
    expect(dateElement.nativeElement.textContent).toContain('Oct 06, 2003');
  });

  it('CbaPage: should display publish Date when revision no is 0', () => {
    fixture.detectChanges();
    var element = fixture.debugElement.query(By.css('#cba-date .content .header'));
    comp['data'] = {
      "revisionNumber":0
    };
    fixture.detectChanges();
    expect(element.nativeElement.textContent).toContain("Published Date");
  });

  it('CbaPage: should display Revision Date when revision no > 0', () => {
    fixture.detectChanges();
    var element = fixture.debugElement.query(By.css('#cba-date .content .header'));
    comp['data'] = {
      "revisionNumber":3
    };
    fixture.detectChanges();
    expect(element.nativeElement.textContent).toContain("Date of Last Revision");
  });

  it('CbaPage: should display all agreement section values', () => {
    fixture.detectChanges();
    var element = fixture.debugElement.query(By.css('#cba-revision-number1'));
    comp['data'] = {
      "cbawdId":7,
      "cbaNumber":"CBA-2003-7",
      "revisionNumber":0,
      "contractServices":"Landscaping services",
      "contractorName":"Hussey Services",
      "contractorUnion":"IAM",
      "localUnionNumber":"123",
      "solicitationContractNo":"F33123",
      "organizationName":"Navy",
      "status":"published",
      "latest":true,
      "createdBy":"138.162.0.41",
      "modifiedBy":"138.162.0.41",
      "effectiveStartDate":"2003-10-01T04:00:00Z",
      "effectiveEndDate":"2006-10-01T04:00:00Z",
      "amendmentDate":"1900-01-01T05:00:00Z",
      "publishedDate":"2003-10-06T04:00:00Z",
      "createdOn":"2003-10-06T04:00:00Z",
      "modifiedOn":"2003-10-06T16:38:27Z",
      "cbaLocation":[{"id":7,"state":"Alabama","county":"Autauga"}]
    };
    fixture.detectChanges();
    expect(element.nativeElement.textContent).toContain(0);

    var element = fixture.debugElement.query(By.css('#cba-agreement-location #cba-agreement-state-0'));
    expect(element.nativeElement.textContent).toContain('Alabama');

    var element = fixture.debugElement.query(By.css('#cba-agreement-location #cba-agreement-county-0'));
    expect(element.nativeElement.textContent).toContain('Autauga');

    var element = fixture.debugElement.query(By.css('#cba-agreement-location #cba-agreement-city-0'));
    expect(element).toBeNull();

    var element = fixture.debugElement.query(By.css('#cba-agreement-location #cba-agreement-zipCode-0'));
    expect(element).toBeNull();

    var element = fixture.debugElement.query(By.css('#cba-agreement-employment #cba-agreement-organization'));
    expect(element.nativeElement.textContent).toContain('Navy');

    var element = fixture.debugElement.query(By.css('#cba-agreement-employment #cba-agreement-contract-services'));
    expect(element.nativeElement.textContent).toContain('Landscaping services');

    var element = fixture.debugElement.query(By.css('#cba-bargaining-agreement #cba-agreement-contractorName'));
    expect(element.nativeElement.textContent).toContain('Hussey Services');

    var element = fixture.debugElement.query(By.css('#cba-bargaining-agreement #cba-agreement-contractorUnion'));
    expect(element.nativeElement.textContent).toContain('IAM');

    var element = fixture.debugElement.query(By.css('#cba-bargaining-agreement #cba-agreement-unionNo'));
    expect(element.nativeElement.textContent).toContain('(local 123)');

    var element = fixture.debugElement.query(By.css('#cba-bargaining-agreement #cba-agreement-date-range'));
    expect(element.nativeElement.textContent.trim()).toContain('effective 10/1/2003 through 10/1/2006');
  });

});
