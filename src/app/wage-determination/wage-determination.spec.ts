// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
// import { MockBackend } from '@angular/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { By }              from '@angular/platform-browser';
// import { ActivatedRoute } from '@angular/router';
// import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
// import { WageDeterminationService } from 'api-kit';
// import { SamUIKitModule } from 'ui-kit';
//
// import { WageDeterminationPage } from './wage-determination.page';
// import { Observable } from 'rxjs';
// import { PipesModule } from '../app-pipes/app-pipes.module';
//
// let comp:    WageDeterminationPage;
// let fixture: ComponentFixture<WageDeterminationPage>;
//
// let MockWageDeterminationService = {
//   getWageDeterminationByReferenceNumberAndRevisionNumber: (referenceNumber: string, revisionNumber: number) => {
//     return Observable.of({
//       "fullReferenceNumber": "2002-0261",
//       "revisionNumber": 8,
//       "location": [
//         {
//           "state": "Texas",
//           "counties": [
//             "Angelina",
//             "Austin",
//             "Brazoria",
//             "Calhoun",
//             "Chambers",
//             "Colorado",
//             "Fayette",
//             "Fort Bend",
//             "Galveston",
//             "Grimes",
//             "Harris",
//             "Houston",
//             "Jackson",
//             "Jasper",
//             "Jefferson",
//             "Lavaca",
//             "Leon",
//             "Liberty",
//             "Madison",
//             "Matagorda",
//             "Montgomery",
//             "Newton",
//             "Orange",
//             "Polk",
//             "Sabine",
//             "Trinity",
//             "Tyler",
//             "Victoria",
//             "Walker",
//             "Washington",
//             "Wharton"
//           ]
//         }
//       ],
//       "services": [
//         "Barber and Beauty Services",
//         "Diver Services",
//         "Residential and Halfway House Services",
//         "Towing and Tender"
//       ],
//       "publishDate": "2007-05-28 19:00:00",
//       "active": false,
//       "standard": false,
//       "_links": {
//         "self": {
//           "href": "https://gsaiae-dev02.reisys.com/wdol/v1/wd/2002-0261/8"
//         }
//       }
//     });
//   }
// };
//
//
// describe('OrganizationPage', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [ WageDeterminationPage ], // declare the test component
//       imports: [
//         HttpModule,
//         RouterTestingModule,
//         SamUIKitModule,
//         PipesModule
//       ],
//       providers: [
//         BaseRequestOptions,
//         MockBackend,
//         {
//           provide: Http,
//           useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
//             return new Http(backend, defaultOptions);
//           },
//           deps: [MockBackend, BaseRequestOptions],
//         },
//         { provide: Location, useClass: Location },
//         { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'referenceNumber': '2002-0261' }, {'revisionNumber': '8'}]), 'queryParams': Observable.from([{}]) } },
//         { provide: LocationStrategy, useClass: HashLocationStrategy },
//         { provide: WageDeterminationService, useValue: MockWageDeterminationService }
//
//       ]
//     });
//
//     TestBed.overrideComponent(WageDeterminationPage, {
//       set: {
//         providers: [
//           { provide: WageDeterminationService, useValue: MockWageDeterminationService }
//         ]
//       }
//     });
//
//     fixture = TestBed.createComponent(WageDeterminationPage);
//     comp = fixture.componentInstance; // BannerComponent test instance
//     fixture.detectChanges();
//   });
//
//   it('Should init & load data', () => {
//     expect(comp.fullReferenceNumber).toBeDefined();
//     expect(comp.revisionNumber).toBeDefined();
//     expect(comp.location).toBeDefined();
//     expect(comp.services).toBeDefined();
//     expect(comp.publishDate).toBeDefined();
//     expect(comp.active).toBeDefined();
//     expect(comp.standard).toBeDefined();
//     //expect(comp.organization.agencyName).toBe("Department of Commerce");
//     //expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerHTML).toContain('Department of Commerce');
//   });
// });
