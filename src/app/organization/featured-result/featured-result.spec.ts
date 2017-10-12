import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { FHFeaturedResult } from './featured-result.component';
import { FHService } from '../../../api-kit/fh/fh.service';
import { SearchService } from '../../../api-kit/search/search.service';
import { Observable } from 'rxjs/Rx';
import { PipesModule } from '../../app-pipes/app-pipes.module';

var fixture;
var comp;
var titleEl;

var searchServiceStub = {
  featuredSearch: ()=>{
    return Observable.of({
      alternativeNames: null,
      cgac: "abcd1234",
      title: "ML Test Dept",
      description: "",
      _id: "12345",
      type: "DEPARTMENT",
      shortName: "abcd",
      isActive: true,
      parentOrganizationHierarchy: null
    });
  }
};

var fhServiceStub = {};

describe('src/app/organization/featured-result/featured-result.spec.ts', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FHFeaturedResult ],
      providers: [],
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'search', component: FHFeaturedResult}
        ]),
        PipesModule
      ]
    }).overrideComponent(FHFeaturedResult, {
      set: {
        providers: [
          {provide: SearchService, useValue: searchServiceStub},
          {provide: FHService, useValue: fhServiceStub}
        ]
      }
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(FHFeaturedResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.federal-hierarchy-title')); // find title element
      comp.data = {
        shortName: "ST",
        title: "SAMPLE TITLE",
        isActive:true,
        description: "abcd",
        parentOrganizationHierarchy: {
          "name" : "Department Name"
        }
      };
      fixture.detectChanges();// trigger data binding
  });
  }));

  it('FHFeaturedResultComponent: should display a title', () => {
    expect(fixture.componentInstance.data.title).toContain("SAMPLE TITLE");
  });
});
